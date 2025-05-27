public class TypeCastingExample {
    public static void main(String[] args) {
        double myDouble = 9.78;
        int myInt = (int) myDouble; // Explicit casting

        int anotherInt = 100;
        double anotherDouble = anotherInt; // Implicit casting

        System.out.println("Double to Int: " + myInt);
        System.out.println("Int to Double: " + anotherDouble);
    }
}

