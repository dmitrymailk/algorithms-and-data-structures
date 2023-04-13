# https://the-algorithms.com/algorithm/fast-fibonacci
"""
This program calculates the nth Fibonacci number in O(log(n)).
It's possible to calculate F(1_000_000) in less than a second.
"""


def fibonacci(n: int) -> int:
    """
    return F(n)
    >>> [fibonacci(i) for i in range(13)]
    [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]
    """
    return _fib(n)[0]


# returns (F(n), F(n-1))
def _fib(n: int) -> tuple[int, int]:
    if n == 0:  # (F(0), F(1))
        return (0, 1)

    # F(2n) = F(n)[2F(n+1) − F(n)]
    # F(2n+1) = F(n+1)^2+F(n)^2
    F_n, F_n_1 = _fib(n // 2)

    F_2n = F_n * (F_n_1 * 2 - F_n)
    F_2n_1 = F_n**2 + F_n_1**2

    if n % 2:
        return (F_2n_1, F_2n + F_2n_1)
    else:
        return (F_2n, F_2n_1)


if __name__ == "__main__":
    print(fibonacci(1))
    print(fibonacci(2))
    print(fibonacci(3))
    print(fibonacci(4))
    print(fibonacci(5))
