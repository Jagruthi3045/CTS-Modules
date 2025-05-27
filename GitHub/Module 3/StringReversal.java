import java.util.Scanner;

public class StringReversal {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a string: ");
        String original = sc.nextLine();
        String reversed = new StringBuilder(original).reverse().toString();
        System.out.println("Reversed string: " + reversed);
        sc.close();
    }
}

