cached_fib = {} #memoization


def fib(n):
    if n in cached_fib:
        return cached_fib[n]

    if n == 1:
        value = 1
    elif n == 2:
        value = 1
    elif n > 2:
       value = fib(n-1) + fib(n-2) #recursive(a função chama a função só que numa forma reduzida)
    cached_fib[n] = value
    return value


for n in range(1, 625):
    print(n, ":", fib(n))