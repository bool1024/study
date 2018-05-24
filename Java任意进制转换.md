##### 问题：将m进制num转换为n进制（2<=m,n<=62）
##### 思路：先将m进制转换为10进制，再将10进制转换为n进制

1. m进制转换为10进制  
从低位到高位按权展开即可  
例如：8进制1356转为10进制  
6*8^0 + 5 * 8^1 + 3 * 8^2 + 1 * 8^3 = 750 

2. 10进制转为n进制   
采用除留取余，逆序排列。  
例如：10进制65036转为16进制   
65036 除 16，余数 12(C)，商4064   
4064 除 16，余数 0(0)，商254   
254 除 16，余数 14(E)，商15   
15除16，余数 15(F)，商0，结束   
得16进制为 FE0C  

```
import java.util.Scanner;
import java.util.Stack;

public class Conversion{
    private static String numStr = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    private static char[] array = numStr.toCharArray();

    /**
     * @see    10进制转为其他进制，除留取余，逆序排列
     * @param number 10进制数
     * @param N  转换成的额进制
     * @return
     */
    public static String _10_to_N(long number, int N) {
        Long rest = number;
        Stack<Character> stack = new Stack<Character>();
        StringBuilder result = new StringBuilder(0);
        while (rest != 0) {
            stack.add(array[new Long((rest % N)).intValue()]);
            rest = rest / N;
        }
        for (; !stack.isEmpty();) {
            result.append(stack.pop());
        }
        return result.length() == 0 ? "0":result.toString();
    }

    /**
     * @see    其他进制转为10进制，按权展开
     * @param number 需要转换的数字
     * @param N 其他进制
     * @return
     */
    public static long N_to_10(String number, int N) {
        char ch[] = number.toCharArray();
        int len = ch.length;
        long result = 0;
        if (N == 10) {
            return Long.parseLong(number);
        }
        long base = 1;
        for (int i = len - 1; i >= 0; i--) {
            int index = numStr.indexOf(ch[i]);
            result += index * base;
            base *= N;
        }
        return result;
    }


    public static void main(String[] args) {
          Scanner in = new Scanner(System.in);
          while(in.hasNext()){
            int src = in.nextInt();
            int aim = in.nextInt();
            String intStr = in.next();
            Long tmp= N_to_10(intStr, src);                     
            String tmp2 = _10_to_N(tmp, aim);
            String newStr = tmp2.replaceFirst("^0*", "");  
            System.out.println(newStr);
          }
    }
}
```
