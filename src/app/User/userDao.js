// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = "SELECT * FROM Users";
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

async function selectUserId(connection, userId) {
  const selectUserIdQuery = "SELECT * FROM Users WHERE user_id = ?";
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

async function updateUserProfileInfo(connection, userId, nickname, imageUrl) {
  const updateUserQuery = `UPDATE Users SET nickname = ?, image_url = ? WHERE user_id=?;`;
  const updateUserRow = await connection.query(updateUserQuery, [
    nickname,
    imageUrl,
    userId,
  ]);
  return updateUserRow[0];
}

async function insertUserInfo(connection, insertUserProfileParams) {
  const insertUserProfileQuery = `INSERT INTO Users(nickname, image_url) VALUES (?, ?);`;
  const insertUserProfileInfoRow = await connection.query(
    insertUserProfileQuery,
    insertUserProfileParams
  );

  return insertUserProfileInfoRow;
}

// 유저가 특정 포인트에 좋아요 표시
async function insertUserPointLike(connection, userId, pointId) {
  const insertUserPointQuery = `
  INSERT INTO User_point_likes(user_id, point_id)
      VALUES (?, ?);
  `;
  const updateUserRow = await connection.query(insertUserPointQuery, [
    userId,
    pointId,
  ]);
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

module.exports = {
  selectUser,
  selectUserId,
  updateUserProfileInfo,
  insertUserInfo,
  insertUserPointLike,
  selectUserPointLike,
  deleteUserPointLike,
};
