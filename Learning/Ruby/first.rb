# Arithmetic operators
puts "6 + 4 = " + (6+4).to_s
puts "6 - 4 = " + (6-4).to_s
puts "6 * 4 = " + (6*4).to_s
puts "6 / 4 = " + (6/4).to_s
puts "6 % 4 = " + (6%4).to_s

# Everything is an object
puts 1.class
puts 1.555.class
puts "String".class

# Constants
A_CONSTANT = 31.4
A_CONSTANT = 1.6 # Will allow to change but will warn us

puts A_CONSTANT

# Writing file
write_handler = File.new("test.txt", "w")
write_handler.print("Random text").to_s

write_handler.close

data_from_file = File.read("test.txt")

puts "Data from file: " + data_from_file

# Reading another ruby file
load "second.rb"

# Conditionals

# Comparison : == != < > <= >=
# Logical : && || ! and or not 

age = 20

if (age >= 5) && (age <=50)
    puts "Your age is: " + age.to_s
elsif (age > 50) && (age <= 100)
    puts "You're old"
else (age > 100)
    puts "You're dead"
end

unless age > 4 # Same as if (!(age > 4)) ???
    puts "Dead"
else
    puts "Alive"
end

puts "You're young" if age < 50

puts (age >= 50) ? "You're old" : "You're young" # Same as Js

# Looping

x = 1
y = 1

loop do
    x += 1

    next if (x % 2) == 0 # Continue if condition
    puts x
    break if x >=10
end

while y <= 10
    y += 1
    next if (y % 2) == 0 # Continue if condition
    puts y
end

numbers = [1, 2, 3, 4, 5]

for number in numbers
    print number != 5 ? "#{number}, " : "#{number}"
end
puts

numbers.each do |number|
    print number != 5 ? "#{number}, " : "#{number}"
end
puts

(1..5).each do |number|
    puts "# #{number}"
end

# Functions
# Variables are passed as values to functions so variables from outside don't change
def add_nums(num_1, num_2)
    return num_1.to_i + num_2.to_i
end

puts add_nums(3, 4)

x = 1

def change_x(x)
    x = 4
    return x
end

y = change_x(x)

puts "x = #{x}" 
puts "y = change_x(x) => y = #{y} because change_x returns 4"

# Exceptions

print "Enter a number: "
first_num = gets.to_i
print "Enter another number: "
second_num = gets.to_i

begin
    answer = first_num / second_num
    puts "#{first_num} / #{second_num} = #{answer}"
rescue => exception
    print exception
end

def check_age(age)
    raise ArgumentError, "Enter a positive number. Got: #{age}." unless age > 0
end

age = -12

begin
    check_age(age)
    puts age
rescue => ArgumentError
    puts ArgumentError
end

age = 12

begin
    check_age(age)
    puts age
rescue => ArgumentError
    puts ArgumentError
end

# Utils

multiline = <<EOM
THIS IS MILTILINE
3 + 3 = #{3 + 3}
EOM

puts multiline

name = "Yuri"
surname = " Corredor"

fullname = name + surname

puts fullname.include?("Corredor")
puts fullname.include?("Justin")
puts fullname.size
puts "Vowels: #{fullname.count("aeiou")}" # fullname.start_with?("Yuri") => true; fullname.index("Yuri") => 0 (index first letter)
puts "Consonants: #{fullname.count("^aeiou")}"
puts fullname.equal?fullname
puts fullname.upcase
puts fullname.downcase
puts fullname.swapcase
fullname += " Eufrazio                "
fullname.strip # lstrip and rstrip
puts fullname
array = fullname.split(//)
puts array

# Escape sequences
# \\ Backslash
# \' Single-quote
# \" Double-quote
# \a Bell
# \b Backspace
# \f Formfeed
# \n Newline
# \r Carriege
# \t Tab
# \v Vertical tab

class Person
    def initialize(dad_name, mom_name)
        @dad_name = dad_name
        @mom_name = mom_name
        puts "Creating a new person"
    end
    
    def set_name(new_name)
        if new_name.is_a?(Numeric)
            puts "Names can't ne numeric"
        else
            @name = new_name
        end
    end

    def name
        @name
    end

    def parents_name
        "Dad's name is #{@dad_name} and mom's name is #{@mom_name}."
    end
end

my = Person.new("Unknown", "Binha")

puts my.parents_name
puts my.name
my.set_name("Yuri")
puts my.name

class Dog
    # attr_reader :name, :height, :weight
    # attr_writer :name, :height, :weight
    attr_accessor :name, :height, :weight

    def bark
        "Generic bark"
    end
end

little_dog = Dog.new

little_dog.height = "0.1 m"
little_dog.name = "Yuri the dog"

puts little_dog.name, little_dog.height, little_dog.bark

class GermanShepard < Dog
    def bark
        "German bark"
    end
end

dog = GermanShepard.new
dog.name = "Max"
printf "%s goes %s \n", dog.name, dog.bark # use %d for integers and %f for floats and, of couse, %s for strings