import java.lang.reflect.*;

class ReflectTarget {
    public void show(String msg) {
        System.out.println("Message: " + msg);
    }
}

public class ReflectDemo {
    public static void main(String[] args) throws Exception {
        Class<?> cls = Class.forName("ReflectTarget");

        Method[] methods = cls.getDeclaredMethods();
        for (Method m : methods) {
            System.out.println("Method: " + m.getName());
        }

        Object obj = cls.getDeclaredConstructor().newInstance();
        Method method = cls.getMethod("show", String.class);
        method.invoke(obj, "Hello via Reflection!");
    }
}

