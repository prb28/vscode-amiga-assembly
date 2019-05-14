#include <stdio.h>
extern int mul_by_ten(short input);

int main()
{
    short i;

    for (i = 0; i < 10; i++)
        printf("10 * %d = %d\n", i, mul_by_ten(i));

    return 0;
}