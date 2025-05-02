// transactionExample.js
const pool = require('./db');

async function doTransaction() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const studentId = 'S10810001';
    const newDeptId = 'EE001';

    // 查學生是否存在
    const students = await conn.query('SELECT * FROM STUDENT WHERE Student_ID = ?', [studentId]);
    if (students.length === 0) {
      throw new Error(`查無學號為 ${studentId} 的學生，交易中止。`);
    }

    // 更新系所
    const updateStudent = 'UPDATE STUDENT SET Department_ID = ? WHERE Student_ID = ?';
    await conn.query(updateStudent, [newDeptId, studentId]);

    await conn.commit();
    console.log('✅ 交易成功，已提交');

    // 查詢修改後的系所資訊
    const result = await conn.query(
      `SELECT s.Student_ID, s.Name, d.Name AS Department_Name
       FROM STUDENT s
       JOIN DEPARTMENT d ON s.Department_ID = d.Department_ID
       WHERE s.Student_ID = ?`, [studentId]
    );

    if (result.length > 0) {
      const student = result[0];
      console.log(`📌 學生 ${student.Name}（${student.Student_ID}）目前系所為：${student.Department_Name}`);
    } else {
      console.log('⚠️ 查詢學生系所資訊失敗。');
    }

  } catch (err) {
    if (conn) await conn.rollback();
    console.error('❌ 交易失敗，已回滾：', err.message);
  } finally {
    if (conn) conn.release();
  }
}

doTransaction();
