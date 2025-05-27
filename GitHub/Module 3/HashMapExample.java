import java.util.HashMap;
import java.util.Scanner;

public class HashMapExample {
    public static void main(String[] args) {
        HashMap<Integer, String> map = new HashMap<>();
        Scanner sc = new Scanner(System.in);
        map.put(1, "Alice");
        map.put(2, "Bob");
        map.put(3, "Charlie");

        System.out.print("Enter student ID to search: ");
        int id = sc.nextInt();
        if (map.containsKey(id)) {
            System.out.println("Student Name: " + map.get(id));
        } else {
            System.out.println("ID not found.");
        }
    }
}

