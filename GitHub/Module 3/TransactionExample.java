import java.sql.*;

public class TransactionExample {
    public static void main(String[] args) throws Exception {
        Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/school", "root", "your_password");
        con.setAutoCommit(false);

        try {
            PreparedStatement debit = con.prepareStatement("UPDATE accounts SET balance = balance - ? WHERE id = ?");
            PreparedStatement credit = con.prepareStatement("UPDATE accounts SET balance = balance + ? WHERE id = ?");

            debit.setDouble(1, 100);
            debit.setInt(2, 1);
            debit.executeUpdate();

            credit.setDouble(1, 100);
            credit.setInt(2, 2);
            credit.executeUpdate();

            con.commit();
            System.out.println("Transfer successful.");
        } catch (Exception e) {
            con.rollback();
            System.out.println("Transfer failed. Rolled back.");
            e.printStackTrace();
        }
    }
}

