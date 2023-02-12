// 유저 프로필 생성
exports.insertUserProfile = async function (
  connection,
  insertUserProfileParams
) {
  const insertUserProfileQuery = `INSERT INTO Users(nickname, image_url) VALUES (?, ?);`;
  const userRows = await connection.query(
    insertUserProfileQuery,
    insertUserProfileParams
  );

  return userRows[0];
};

// 카카오 아이디로 유저 프로필 생성
exports.insertUserProfileByKakaoId = async function (connection, params) {
  const query = `INSERT INTO Users(user_id, nickname, image_url) VALUES (?, ?, ?);`;
  const userRows = await connection.query(query, params);

  return userRows[0];
};

// 모든 유저 프로필 조회
exports.selectUserProfile = async function (connection) {
  const selectUserProfileQuery = "SELECT * FROM Users";
  const [userRows] = await connection.query(selectUserProfileQuery);
  return userRows;
};

// 닉네임으로 유저 프로필 조회
exports.selectUserProfileByNickname = async function (connection, nickname) {
  const selectUserProfileByNicknameQuery =
    "SELECT * FROM Users WHERE nickname = ?;";
  const [userRows] = await connection.query(
    selectUserProfileByNicknameQuery,
    nickname
  );
  return userRows;
};

// 아이디로 유저 프로필 조회
exports.selectUserProfileById = async function (connection, userId) {
  const selectUserProfileByIdQuery = "SELECT * FROM Users WHERE user_id = ?";
  const [userRows] = await connection.query(selectUserProfileByIdQuery, userId);
  return userRows;
};

// userId로 포인트 조회
exports.selectPointByUserId = async function (connection, userId) {
  const selectUserIdQuery = `
                 SELECT p.point_id, title, content, point_type, creature, point_date, location, imgList as point_img_list
                 FROM Points p
                        left join (
                   select point_id, group_concat(image_url) as imgList
                   from Point_images
                   group by point_id
                 ) as pi on pi.point_id = p.point_id
                 WHERE user_id = ?;
                 `;
  const [pointRow] = await connection.query(selectUserIdQuery, userId);
  return pointRow;
};

// 유저 프로필 업데이트
exports.updateUserProfile = async function (connection, userId, imageUrl) {
  const updateUserProfileQuery = `UPDATE Users SET image_url = ? WHERE user_id=?;`;
  const userRows = await connection.query(updateUserProfileQuery, [
    imageUrl,
    userId,
  ]);
  console.log("userRows[0]", userRows[0]);
  return userRows[0];
};

// 유저 프로필 삭제
exports.deleteUserProfile = async function (connection, userId) {
  const query = "UPDATE Users SET status = 'inactive' WHERE user_id = ?;";
  const [result] = await connection.query(query, userId);
  return result;
};

// 유저가 좋아요한 포인트 조회
exports.selectUserLike = async function (connection, params) {
  const selectUserLikeQuery = `
  SELECT p.point_id, p.title, p.point_date, pi.imgList as point_img_list
  FROM Points p
  LEFT JOIN (select user_id, point_id
             from User_point_likes) as upl
  ON p.point_id=upl.point_id
  left join (
    select point_id, group_concat(image_url) as imgList
    from Point_images
    group by point_id
  ) as pi on pi.point_id = p.point_id
  WHERE upl.user_id = ?
  ORDER BY p.point_date DESC
  LIMIT ?, 10;
  `;
  const [userLikeRows] = await connection.query(selectUserLikeQuery, params);
  return userLikeRows;
};

// 유저가 특정 포인트에 좋아요 표시
exports.insertUserPointLike = async function (connection, userId, pointId) {
  const insertUserPointQuery = `
  INSERT INTO User_point_likes(user_id, point_id)
      VALUES (?, ?);
  `;
  const updateUserRow = await connection.query(insertUserPointQuery, [
    userId,
    pointId,
  ]);
  return updateUserRow[0];
};

// 유저가 특정 포인트에 좋아요 표시했는지에 대해 체크
exports.selectUserPointLike = async function (connection, userId, pointId) {
  const selectUserPointLikeQuery = `
        SELECT user_point_like_id, status
        FROM User_point_likes 
        WHERE user_id = ? and point_id = ?;`;
  const [selectUserPointLikeRow] = await connection.query(
    selectUserPointLikeQuery,
    [userId, pointId]
  );
  return selectUserPointLikeRow;
};

// 유저가 특정 포인트 좋아요 취소
exports.deleteUserPointLike = async function (connection, userId, pointId) {
  const deleteUserPointLikeQuery = `
        DELETE 
        FROM User_point_likes 
        WHERE user_id = ? and point_id = ?;`;
  const deleteUserPointLikeRow = await connection.query(
    deleteUserPointLikeQuery,
    [userId, pointId]
  );
  return deleteUserPointLikeRow;
};

// 유저가 특정 포인트 좋아요 취소
exports.updateUserPointLike = async function (connection, userId, filePath) {
  const updateUserProfileQuery = `
        UPDATE Users 
        SET image_url = ?
        WHERE user_id = ?;`;
  const updateUserProfileRow = await connection.query(updateUserProfileQuery, [
    filePath,
    userId,
  ]);
  return updateUserProfileRow;
};
