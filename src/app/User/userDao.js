// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, nickname 
                FROM UserInfo;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email, nickname 
                FROM UserInfo 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT user_id, nickname 
                 FROM Users
                 WHERE user_id = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO UserInfo(email, password, nickname)
        VALUES (?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT email, nickname, password
        FROM UserInfo 
        WHERE email = ? AND password = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, id
        FROM UserInfo 
        WHERE email = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, id, nickname) {
  const updateUserQuery = `
  UPDATE UserInfo 
  SET nickname = ?
  WHERE id = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
  return updateUserRow[0];
}

// 유저가 특정 포인트에 좋아요 표시
async function insertUserPointLike(connection, userId, pointId) {
  const insertUserPointQuery = `
  INSERT INTO User_point_likes(user_id, point_id)
      VALUES (?, ?);
  `
  const updateUserRow = await connection.query(insertUserPointQuery, [userId, pointId]);
  return updateUserRow[0];
}

// 유저가 특정 포인트에 좋아요 표시했는지에 대해 체크
async function selectUserPointLike(connection, userId, pointId) {
  const selectUserPointLikeQuery = `
        SELECT user_point_like_id, status
        FROM User_point_likes 
        WHERE user_id = ? and point_id = ?;`;
  const [selectUserPointLikeRow] = await connection.query(
      selectUserPointLikeQuery,
      [userId, pointId]
  );
  return selectUserPointLikeRow;
}

// 유저가 특정 포인트 좋아요 취소
async function deleteUserPointLike(connection, userId, pointId) {
  const deleteUserPointLikeQuery = `
        DELETE 
        FROM User_point_likes 
        WHERE user_id = ? and point_id = ?;`;
  const deleteUserPointLikeRow = await connection.query(
      deleteUserPointLikeQuery,
      [userId, pointId]
  );
  return deleteUserPointLikeRow;
}

// 유저가 특정 포인트 좋아요 취소
async function updateUserProfile(connection, userId, filePath) {
  const updateUserProfileQuery = `
        UPDATE Users 
        SET image_url = ?
        WHERE user_id = ?;`;
  const updateUserProfileRow = await connection.query(
      updateUserProfileQuery,
      [filePath, userId]
  );
  return updateUserProfileRow;
}

module.exports = {
  selectUser,
  selectUserEmail,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
  insertUserPointLike,
  selectUserPointLike,
  deleteUserPointLike,
  updateUserProfile
};
