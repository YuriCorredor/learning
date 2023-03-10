from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from flask_login import current_user
from wtforms import StringField, PasswordField, SubmitField, BooleanField, TextAreaField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
from flask_pack.models import User


class RegistrationForm(FlaskForm):
    username = StringField('Usuário', validators=[
                           DataRequired(), Length(min=2, max=20)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Senha', validators=[DataRequired()])
    password2 = PasswordField('Confirmação da senha', validators=[
                              DataRequired(), EqualTo('password')])
    submit = SubmitField('Confirmar')

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('Nome de usuário já em uso!')

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('Email já em uso! Por favor, escolha outro.')


class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Senha', validators=[DataRequired()])
    remember = BooleanField('Lembre-se de mim')
    submit = SubmitField('Entrar')


class UpdateAccountForm(FlaskForm):
    username = StringField('Usuário', validators=[
                           DataRequired(), Length(min=2, max=20)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    pic = FileField('Mudar foto de perfil', validators=[
                    FileAllowed(['jpg', 'png', 'jpeg', 'RAW'])])
    submit = SubmitField('MUDAR')

    def validate_username(self, username):
        if username.data != current_user.username:
            user = User.query.filter_by(username=username.data).first()
            if user:
                raise ValidationError('Nome de usuário já em uso!')

    def validate_email(self, email):
        if email.data != current_user.email:
            user = User.query.filter_by(email=email.data).first()
            if user:
                raise ValidationError(
                    'Email já em uso! Por favor, escolha outro.')


class PostForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired()])
    content = TextAreaField('Content', validators=[DataRequired(),Length(min=2, max=1200)])
    submit = SubmitField('ENVIAR')


class RequestResetForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    submit = SubmitField('ENVIAR')

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user is None:
            raise ValidationError(
                'Não temos registro de uma conta com esse email.')


class ResertPasswordForm(FlaskForm):
    password = PasswordField('Senha', validators=[DataRequired()])
    password2 = PasswordField('Confirmação da senha', validators=[
                              DataRequired(), EqualTo('password')])
    submit = SubmitField('Confirmar')
