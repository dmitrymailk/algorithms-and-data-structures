# https://the-algorithms.com/algorithm/abbreviation
"""
https://www.hackerrank.com/challenges/abbr/problem
You can perform the following operation on some string, :

1. Capitalize zero or more of 's lowercase letters at some index i
   (i.e., make them uppercase).
2. Delete all of the remaining lowercase letters in .

Example:
a=daBcd and b="ABC"
daBcd -> capitalize a and c(dABCd) -> remove d (ABC)

"""


def abbr(
    A: str,
    B: str,
) -> bool:
    """
    >>> abbr("daBcd", "ABC")
    True
    >>> abbr("dBcd", "ABC")
    False
    """
    A_len = len(A)
    B_len = len(B)
    dp = [[False for _ in range(B_len + 1)] for _ in range(A_len + 1)]
    """
    [
        [False, False, False, False], 
        [False, False, False, False], 
        [False, False, False, False], 
        [False, False, False, False], 
        [False, False, False, False], 
        [False, False, False, False]
    ]
    """
    """
    каждая строка отвечает за букву из А
    каждый элемент в строке отвечает за букву из В 
    
    берем первую букву из А
    начинаем сравнивать все буквы из В с буквой из А
    если буква из А совпала с буквой из В, то 
    помечаем следующую букву по А и следующую букву по В
    
    скорее всего идея такая что если нам встретилась буква 
    которая удовлетворяет нашему условию, то мы можем проверять 
    следующую букву из а
    """
    dp[0][0] = True
    for i in range(A_len):
        for j in range(B_len + 1):
            # если элемент в таблице истина то
            if dp[i][j]:
                # если счетчик не вышел за границы строки В и
                # при капитализации буквы с A[i] совпадают с текущей
                # то мы заполняем истиной следующую ячейку по i и j
                #! но почему и зачем?
                if j < B_len and A[i].upper() == B[j]:
                    dp[i + 1][j + 1] = True
                # если буква в А маленькая, то
                # делаем следующую вариацию строки В по индексу j истиной
                if A[i].islower():
                    dp[i + 1][j] = True
    # !почему-то ответом является то значение которое стоит на диагонале
    # по индексу dp[A_len][B_len]
    return dp[A_len][B_len]


if __name__ == "__main__":
    print(abbr("daBcd", "ABC"))
    print(abbr("dBcd", "ABC"))
