import java.sql.*;

public class StudentDAO {
    private Connection con;

    public StudentDAO() throws Exception {
        con = DriverManager.getConnection("jdbc:mysql://localhost:3306/school", "root", "your_password");
    }

    public void insertStudent(int id, String name, String grade) throws SQLException {
        String sql = "INSERT INTO students VALUES (?, ?, ?)";
        PreparedStatement ps = con.prepareStatement(sql);
        ps.setInt(1, id);
        ps.setString(2, name);
        ps.setString(3, grade);
        ps.executeUpdate();
        System.out.println("Inserted.");
    }

    public void updateStudent(int id, String newGrade) throws SQLException {
        String sql = "UPDATE students SET grade=? WHERE id=?";
        PreparedStatement ps = con.prepareStatement(sql);
        ps.setString(1, newGrade);
        ps.setInt(2, id);
        ps.executeUpdate();
        System.out.println("Updated.");
    }

    public static void main(String[] args) throws Exception {
        StudentDAO dao = new StudentDAO();
        dao.insertStudent(3, "Charlie", "B+");
        dao.updateStudent(2, "A-");
    }
}
