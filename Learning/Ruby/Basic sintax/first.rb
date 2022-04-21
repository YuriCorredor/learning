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

# print "Enter a number: "
# first_num = gets.to_i
# print "Enter another number: "
# second_num = gets.to_i

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

require_relative "module"
require_relative "module_smart"

class Smart_human
    include Human
    include Smart
end

scientist = Smart_human.new

puts scientist.act_smart

scientist.name = "Einstein"
puts scientist.name

# Arrays

array_1 = Array.new
array_2 = Array.new(10)
array_3 = Array.new(10, "empty")
array_4 = [3, 1, 5.5, "seven", 6, 9]

puts array_1, array_2, array_3, array_4

puts array_4[2]
puts array_4[2, 3].join(", ")
puts array_4.values_at(0, 1, 3).join(", ")
array_4.unshift(0)
p array_4
array_4.push(200, 300)
p array_4
array_4.pop
p array_4
array_4.concat([400, 500, 600])
p array_4

puts "Array size: #{array_4.size.to_s}"
puts "Array contains 100: #{array_4.include?(100).to_s}"
puts "How many 6: #{array_4.count(6).to_s}"
puts "Array is empty: #{array_4.empty?.to_s}"

# Hash

number_hash = {
    "PI" => 3.14,
    "Golden" => 1.618,
    "e" => 2.718
}

puts number_hash["PI"]

superheroes = Hash["Clark", "Superman", "Bruce", "Batman"]

puts superheroes["Clark"]

superheroes["Barry"] = "Flash"
puts superheroes["Clark"]

hash = Hash.new("No such key")
p hash["Dog"]

superheroines = {
    "Lisa" => "Aquagirl",
    "Betty" => "Batgirl"
}

superheroes.update(superheroines)
puts superheroes

superheroes.each do |key, value|
    puts "#{key.to_s} : #{value.to_s}"
end

puts "Has Key Lisa: #{superheroes.has_key?("Lisa")}"
puts "Has Value Batman: #{superheroes.has_value?("Batman")}"
puts "Is has empty: #{superheroes.empty?.to_s}"
puts "Size of hash: #{superheroes.size.to_s}"
superheroes.delete("Barry")
puts "Size of hash: #{superheroes.size.to_s}"