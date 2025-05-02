// crudExample.js
const pool = require('./db');

async function basicCrud() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    // 1. INSERT 新增
    let sql = `
      INSERT INTO STUDENT 
      (Student_ID, Name, Birth_Date, Gender, Email, Address, Admission_Year, Status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await conn.query(sql, [
      'S10810001',
      '王曉明',
      '2000-01-01',
      'M',
      'wang@example.com',
      '台北市大安區',
      2018,
      '在學'
    ]);
    console.log('✅ 已新增一筆學生資料');
    
    // 2. SELECT 查詢
    sql = 'SELECT * FROM STUDENT WHERE Admission_Year = ?';
    const rows = await conn.query(sql, [2018]);
    console.log('🔍 查詢結果：', rows);
    
    // 3. UPDATE 更新（先檢查學號是否存在）
    const studentIdToUpdate = 'S10810001';
    sql = 'SELECT * FROM STUDENT WHERE Student_ID = ?';
    const [student] = await conn.query(sql, [studentIdToUpdate]);

    if (student) {
      // 學號存在，才進行更新
      sql = 'UPDATE STUDENT SET Name = ? WHERE Student_ID = ?';
      await conn.query(sql, ['王小明', studentIdToUpdate]);
      console.log('✅ 已更新學生名稱');
    } else {
      // 學號不存在
      console.log('⚠️ 找不到該學生，無法更新');
    }
    
    // 4. DELETE 刪除
    //sql = 'DELETE FROM STUDENT WHERE Student_ID = ?';
    //await conn.query(sql, ['S10810001']);
    //console.log('✅ 已刪除該學生');
    
  } catch (err) {
    console.error('操作失敗：', err);
  } finally {
    if (conn) conn.release();
  }
}

basicCrud();
