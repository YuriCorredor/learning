import os
import secrets
from PIL import Image
from flask import render_template, url_for, redirect, flash, request, abort, make_response, jsonify
from flask_pack import app, db, bcrypt, mail, socketio, send
from flask_pack.forms import (RegistrationForm, LoginForm, UpdateAccountForm,
                              PostForm, RequestResetForm, ResertPasswordForm)
from flask_pack.models import User, Post
from flask_login import login_user, current_user, logout_user, login_required
from flask_mail import Message


#INICIO
@app.route('/')
@app.route('/home/')
def home():
    print(current_user)
    if current_user.is_authenticated:
        image_file = url_for(
            'static', filename=f'profile_pic/{current_user.image_file}')
    else:
        image_file = None
    return render_template('home.html', title='Home', image_file=image_file)


#REGISTRAR
@app.route('/register/', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_pw = bcrypt.generate_password_hash(
            form.password.data).decode('utf-8')
        user = User(username=form.username.data,
                    email=form.email.data, password=hashed_pw)
        db.session.add(user)
        db.session.commit()
        return redirect(url_for('login'))
    return render_template('register.html', title='Registre-se', form=form)


#LOGIN
@app.route('/login/', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('home'))
        else:
            pass
    return render_template('login.html', title='Logue', form=form)


#SAIR
@app.route('/logout/')
def logout():
    logout_user()
    return redirect(url_for('home'))


#SALVAR IMAGEM
def save_pic(pic):

    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(pic.filename)
    pic_fn = random_hex + f_ext

    pic_path = os.path.join(
        app.root_path, 'static/profile_pic', pic_fn)

# redimensionando a imagem com PIL (PILLOW)
    output_size = (120, 120)
    i = Image.open(pic)
    i.thumbnail(output_size)
    i.save(pic_path)

    return pic_fn


#CONTA
@app.route('/conta/', methods=['GET', 'POST'])
@login_required
def conta():
    form = UpdateAccountForm()
    if form.validate_on_submit():

        if form.pic.data:
            old_pic = current_user.image_file
            pic_file = save_pic(form.pic.data)
            current_user.image_file = pic_file
            if old_pic != 'default.jpg':
                os.remove(os.path.join(app.root_path,
                                       'static/profile_pic', old_pic))

        current_user.username = form.username.data
        current_user.email = form.email.data
        db.session.commit()
        return redirect(url_for('conta'))
    elif request.method == 'GET':
        form.username.data = current_user.username
        form.email.data = current_user.email
    image_file = url_for(
        'static', filename=f'profile_pic/{current_user.image_file}')
    return render_template('conta.html', title='Conta', image_file=image_file, form=form)


#FORUM
@app.route('/forum/', methods=['GET', 'POST'])
@login_required
def forum():
    page = request.args.get('page', default=1, type=int)
    posts = Post.query.order_by(
        Post.date_posted.desc()).paginate(page=page, per_page=5)
    if current_user.is_authenticated:
        image_file = url_for(
            'static', filename=f'profile_pic/{current_user.image_file}')
    else:
        image_file = None
    return render_template('forum.html', title='Forum', image_file=image_file, posts=posts)


#LIKES
@app.route('/post/<int:post_id>/<action>', methods=['POST', 'GET'])
@login_required
def like(post_id, action):
    post = Post.query.filter_by(id=post_id).first_or_404()
    if action == 'like':
        current_user.like_post(post)
        db.session.commit()
    if action == 'deslike':  
        current_user.unlike_post(post)
        db.session.commit()

    req = request.get_json()
    res = make_response(jsonify({str(current_user.id): str(post.id)}), 200)
    return res
    

#NOVA POSTAGEM
@app.route('/new_post/', methods=['GET', 'POST'])
@login_required
def new_post():
    form = PostForm()
    image_file = url_for(
        'static', filename=f'profile_pic/{current_user.image_file}')
    if form.validate_on_submit():
        post = Post(title=form.title.data,
                    content=form.content.data, author=current_user)
        db.session.add(post)
        db.session.commit()
        return redirect(url_for('forum'))

    return render_template('new_post.html', title='Postagem', image_file=image_file, form=form, titulo='Nova postagem')


#ATUALIZAR POST
@app.route('/post/<int:post_id>/update', methods=['GET', 'POST'])
@login_required
def update_post(post_id):
    image_file = url_for(
        'static', filename=f'profile_pic/{current_user.image_file}')
    post = Post.query.get_or_404(post_id)
    form = PostForm()

    if post.author == current_user or current_user.id <= 3:

        if form.validate_on_submit():
            post.title = form.title.data
            post.content = form.content.data
            db.session.commit()
            return redirect(url_for('forum'))
    else:
        abort(403)

    if request.method == 'GET':
        form.title.data = post.title
        form.content.data = post.content

    return render_template('new_post.html', title='Mudar a postagem', image_file=image_file, form=form, titulo='Mudar postagem')


#DELETAR POST
@app.route('/post/<int:post_id>/delete', methods=['POST'])
@login_required
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    if post.author == current_user or current_user.perm == True:
        db.session.delete(post)
        db.session.commit()
        return redirect(request.referrer)
    else:
        abort(403)


#ENVIAR EMAIL
def send_reset_email(user):
    token = user.get_reset_token()
    msg = Message('Mudar senha', sender='yuricorredorsendemail@gmail.com', recipients=[user.email])
    msg.body = f'''Para mudar a sua senha, use o link abaixo:    
{url_for('reset_token', token=token, _external=True)}

    Caso não tenha solicitado nenhuma mudança, apenas ignore está mensagem e nenhuma mudança será feita.

    att. equipe Correman
'''
    mail.send(msg)


#MUDAR SENHA
@app.route('/MudarSenha/', methods=['GET', 'POST'])
def reset_request():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    image_file = None
    form = RequestResetForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        send_reset_email(user)
    return render_template('reset_request.html', title='Mudar Senha', form=form, image_file=image_file)


#MUDAR SENHA 2
@app.route('/MudarSenha/<token>', methods=['GET', 'POST'])
def reset_token(token):
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    image_file = None
    user = User.verify_reset_token(token)
    if user is None:
        return redirect(url_for('reset_request'))
    form = ResertPasswordForm()
    if form.validate_on_submit():
        hashed_pw = bcrypt.generate_password_hash(
            form.password.data).decode('utf-8')
        user.password = hashed_pw
        db.session.commit()
        return redirect(url_for('login'))
    return render_template('reset_token.html', title='Mudar Senha', form=form, image_file=image_file)


#CHAT   
@socketio.on('message')
def handleMessage(msg):
    print(f'Message: {msg}')
    send(msg, broadcast=True)


@app.route('/teste/')
def teste():
    posts = Post.query.order_by(Post.date_posted.desc())
    return render_template('teste.html', posts=posts)