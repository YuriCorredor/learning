# print "Enter a value: "

# first_num = gets.to_i

# print "Enter another value: " # Will NOT print a line after it; puts WILL print a line after it.

# second_num = gets.to_i

# puts first_num.to_s + " + " + second_num.to_s + " = " + (first_num + second_num).to_s

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