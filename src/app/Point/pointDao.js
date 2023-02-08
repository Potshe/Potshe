// pointId 포인트 조회
async function selectPointById(connection, pointId) {
  const selectPointIdQuery = `
        select p.point_id, p.title, p.content, p.point_type, p.creature, p.point_date, p.location, count(upl.point_id) as likes, u.nickname, imgList as point_image_list, ll.latitude, ll.longitude
        from Points as p left outer join (
            select point_id
            from User_point_likes
        ) as upl on p.point_id = upl.point_id
                         left join (
            select user_id, nickname
            from Users
        ) as u on p.user_id = u.user_id
                         left join (
            select point_id, group_concat(image_url) as imgList
            from Point_images
            group by point_id
        ) as pi on pi.point_id = p.point_id
                         left join (
            select point_id, latitude, longitude
            from Map_points
        ) as ll on ll.point_id = p.point_id
        
        where p.point_id = ?
        group by p.point_id`;

  const [pointRow] = await connection.query(selectPointIdQuery, pointId);
  return pointRow;
}

// 전체 포인트 조회
async function selectPoints(connection, pageId) {
  const selectPointsQuery = `
          select p.point_id, p.title, p.content, p.point_type, p.creature, p.point_date as point_date, p.location, count(upl.point_id) as likes, u.nickname, imgList as point_image_list, ll.latitude, ll.longitude
          from Points as p left outer join (
              select point_id
              from User_point_likes
          ) as upl on p.point_id = upl.point_id
                           left join (
              select user_id, nickname
              from Users
          ) as u on p.user_id = u.user_id
                           left join (
              select point_id, group_concat(image_url) as imgList
              from Point_images
              group by point_id
          ) as pi on pi.point_id = p.point_id
                           left join (
              select point_id, latitude, longitude
              from Map_points
          ) as ll on ll.point_id = p.point_id
          group by p.point_id
          LIMIT ?, 10
                   `;
  const [pointRow] = await connection.query(
    selectPointsQuery,
    (pageId - 1) * 10
  );
  return pointRow;
}
// 전체 포인트 조회 + 추천순(좋아요순)
async function selectPointsOrderByLikes(connection, pageId) {
  const selectPointsQuery = `
          select p.point_id, p.title, p.content, p.point_type, p.creature, p.point_date as point_date, p.location, count(upl.point_id) as likes, u.nickname, imgList as point_image_list, ll.latitude, ll.longitude
          from Points as p left outer join (
              select point_id
              from User_point_likes
          ) as upl on p.point_id = upl.point_id
                           left join (
              select user_id, nickname
              from Users
          ) as u on p.user_id = u.user_id
                           left join (
              select point_id, group_concat(image_url) as imgList
              from Point_images
              group by point_id
          ) as pi on pi.point_id = p.point_id
                           left join (
              select point_id, latitude, longitude
              from Map_points
          ) as ll on ll.point_id = p.point_id
          group by p.point_id
          order by likes desc
          LIMIT ?, 10
                   `;
  const [pointRow] = await connection.query(
    selectPointsQuery,
    (pageId - 1) * 10
  );
  return pointRow;
}
// 전체 포인트 조회 + 최신순
async function selectPointsOrderByTime(connection, pageId) {
  const selectPointsQuery = `
          select p.point_id, p.title, p.content, p.point_type, p.creature, p.point_date as point_date, p.location, count(upl.point_id) as likes, u.nickname, imgList as point_image_list, ll.latitude, ll.longitude
          from Points as p left outer join (
              select point_id
              from User_point_likes
          ) as upl on p.point_id = upl.point_id
                           left join (
              select user_id, nickname
              from Users
          ) as u on p.user_id = u.user_id
                           left join (
              select point_id, group_concat(image_url) as imgList
              from Point_images
              group by point_id
          ) as pi on pi.point_id = p.point_id
                           left join (
              select point_id, latitude, longitude
              from Map_points
          ) as ll on ll.point_id = p.point_id
          group by p.point_id
          order by point_date desc
          LIMIT ?, 10
                   `;
  const [pointRow] = await connection.query(
    selectPointsQuery,
    (pageId - 1) * 10
  );
  return pointRow;
}

// 키워드 기반 포인트 조회
async function selectPointsByKeyword(connection, keywordParams) {
  const selectPointsByKeywordQuery = `
        select p.point_id, p.title, p.content, p.point_type, p.creature, p.point_date, p.location, count(upl.point_id) as likes, u.nickname, pointImageUrlList as point_img_list, ll.latitude, ll.longitude
        from Points as p left outer join (
            select point_id
            from User_point_likes
        ) as upl on p.point_id = upl.point_id
                         left join (
            select user_id, nickname
            from Users
        ) as u on p.user_id = u.user_id
                         left join (
            select point_id, group_concat(image_url) as pointImageUrlList
            from Point_images
            group by point_id
        ) as pi on pi.point_id = p.point_id
                         left join (
            select point_id, latitude, longitude
            from Map_points
        ) as ll on ll.point_id = p.point_id
        where p.title like concat('%', ? , '%')
           or p.content like concat('%', ?, '%')
           or p.point_type like concat('%', ?, '%')
           or p.creature like concat('%', ?, '%')
           or p.location like concat('%', ?, '%')
        group by p.point_id
       `;
  const [pointRowByKeyword] = await connection.query(
    selectPointsByKeywordQuery,
    keywordParams
  );
  return pointRowByKeyword;
}

// 키워드 기반 포인트 조회 + 추천순
async function selectPointsByKeywordOrderByLikes(connection, keywordParams) {
  const selectPointsByKeywordQuery = `
        select p.point_id, p.title, p.content, p.point_type, p.creature, p.point_date as point_date, p.location, count(upl.point_id) as likes, u.nickname, pointImageUrlList as point_img_list, ll.latitude, ll.longitude
        from Points as p left outer join (
            select point_id
            from User_point_likes
        ) as upl on p.point_id = upl.point_id
                         left join (
            select user_id, nickname
            from Users
        ) as u on p.user_id = u.user_id
                         left join (
            select point_id, group_concat(image_url) as pointImageUrlList
            from Point_images
            group by point_id
        ) as pi on pi.point_id = p.point_id
                         left join (
            select point_id, latitude, longitude
            from Map_points
        ) as ll on ll.point_id = p.point_id
        where p.title like concat('%', ? , '%')
           or p.content like concat('%', ?, '%')
           or p.point_type like concat('%', ?, '%')
           or p.creature like concat('%', ?, '%')
           or p.location like concat('%', ?, '%')
        group by p.point_id
        order by likes desc`;
  const [pointRowByKeyword] = await connection.query(
    selectPointsByKeywordQuery,
    keywordParams
  );
  return pointRowByKeyword;
}

// 키워드 기반 포인트 조회 + 추천순
async function selectPointsByKeywordOrderByTime(connection, keywordParams) {
  const selectPointsByKeywordQuery = `
        select p.point_id, p.title, p.content, p.point_type, p.creature, p.point_date as point_date, p.location, count(upl.point_id) as likes, u.nickname, pointImageUrlList as point_img_list, ll.latitude, ll.longitude
        from Points as p left outer join (
            select point_id
            from User_point_likes
        ) as upl on p.point_id = upl.point_id
                         left join (
            select user_id, nickname
            from Users
        ) as u on p.user_id = u.user_id
                         left join (
            select point_id, group_concat(image_url) as pointImageUrlList
            from Point_images
            group by point_id
        ) as pi on pi.point_id = p.point_id
                         left join (
            select point_id, latitude, longitude
            from Map_points
        ) as ll on ll.point_id = p.point_id
        where p.title like concat('%', ? , '%')
           or p.content like concat('%', ?, '%')
           or p.point_type like concat('%', ?, '%')
           or p.creature like concat('%', ?, '%')
           or p.location like concat('%', ?, '%')
        group by p.point_id
        order by point_date desc`;
  const [pointRowByKeyword] = await connection.query(
    selectPointsByKeywordQuery,
    keywordParams
  );
  return pointRowByKeyword;
}

async function insertPoint(connection, insertPointParams) {
  const insertPointQuery = `
    INSERT INTO Points(user_id, title, content, point_type, location, creature, point_date)
        VALUES (?, ?, ?, ?, ?, ?, ?);

    `;
  const updatePointRow = await connection.query(
    insertPointQuery,
    insertPointParams
  );
  const lastInsertId = await connection.query(
    `select point_id from Points order by created_at DESC limit 1;`
  );
  return lastInsertId[0];
}

async function insertPointImg(connection, insertPointImgParams) {
  const insertPointImgQuery = `
    INSERT INTO Point_images(point_id, image_url)
        VALUES (?, ?);
    `;
  const updatePointRow = await connection.query(
    insertPointImgQuery,
    insertPointImgParams
  );
  return updatePointRow[0];
}

async function updatePointImg(connection, insertPointImgParams) {
  const insertPointImgQuery = `
    INSERT INTO Point_images(point_id, image_url)
        VALUES (?, ?);
    `;
  const updatePointRow = await connection.query(
    insertPointImgQuery,
    insertPointImgParams
  );
  return updatePointRow[0];
}

async function deletePointImg(connection, insertPointImgParams) {
  const insertPointImgQuery = `
    DELETE FROM Point_images WHERE point_id = ?;
    `;
  const updatePointRow = await connection.query(
    insertPointImgQuery,
    insertPointImgParams
  );
  return updatePointRow[0];
}

async function insertPointLocation(connection, insertPointLocationParams) {
  const insertPointLocationQuery = `
    INSERT INTO Map_points(point_id, latitude, longitude)
        VALUES (?, ?, ?);
    `;
  const updatePointRow = await connection.query(
    insertPointLocationQuery,
    insertPointLocationParams
  );
  return updatePointRow[0];
}

async function updatePointLocation(connection, insertPointLocationParams) {
  const insertPointLocationQuery = `UPDATE Map_points
    SET latitude = ?, longitude = ?
        WHERE point_id = ?;
    `;
  const updatePointRow = await connection.query(
    insertPointLocationQuery,
    insertPointLocationParams
  );
  return updatePointRow[0];
}
async function selectUserIdFromPoint(connection, pointId) {
  const selectUserIdFromPointQuery = ` SELECT user_id
    FROM Points
    WHERE point_id = ?;`;
  const selectedUserIdRow = await connection.query(
    selectUserIdFromPointQuery,
    pointId
  );
  return selectedUserIdRow[0];
}

async function updatePoint(connection, editPointParams) {
  const updatePointQuery = `UPDATE Points
    SET title = ?, content = ?, point_type = ?, location = ?, creature = ?, point_date = ?
    WHERE point_id = ?`;
  const updatePointRow = await connection.query(
    updatePointQuery,
    editPointParams
  );
  return updatePointRow[0];
}

async function deletePoint(connection, deletePointParams) {
  const deletePointQuery = ` 
        DELETE p, mp, pi
        FROM Points p, Map_points mp, Point_images pi
        WHERE p.point_id = ? and mp.point_id = ? and pi.point_id = ?;`;
  const deletePointRow = await connection.query(
    deletePointQuery,
    deletePointParams
  );
  return deletePointRow[0];
}

// 모든 map 조회
async function selectMap(connection) {
  const selectMapQuery = `SELECT * FROM Map_points`;
  const [mapRows] = await connection.query(selectMapQuery);
  return mapRows;
}

// point_id 로 map 조회
async function selectMapId(connection, pointId) {
  const selectMapIdQuery = `SELECT * FROM Map_points WHERE point_id = ?;`;
  const [mapRows] = await connection.query(selectMapIdQuery, pointId);
  return mapRows;
}

async function selectMapMark(connection, locationParams) {
  console.log(locationParams);
  const selectMarksQuery = `
    select p.point_id, p.title, p.content, p.point_type, p.creature, p.point_date as point_date, p.location, count(upl.point_id) as likes, u.nickname, imgList as point_image_list, ll.latitude, ll.longitude
        from Points as p left outer join (
            select point_id
            from User_point_likes
        ) as upl on p.point_id = upl.point_id
                         left join (
            select user_id, nickname
            from Users
        ) as u on p.user_id = u.user_id
                         left join (
            select point_id, group_concat(image_url) as imgList
            from Point_images
            group by point_id
        ) as pi on pi.point_id = p.point_id
                         left join (
			select point_id, latitude, longitude
            from Map_points
		) as ll on ll.point_id = p.point_id
        where ll.latitude = ? and ll.longitude = ?
        group by p.point_id
        order by point_date desc;
                 `;

  const [markRow] = await connection.query(selectMarksQuery, locationParams);
  console.log(markRow);
  return markRow;
}

module.exports = {
  selectMap,
  selectMapId,
  selectPointById,
  selectPoints,
  selectPointsOrderByLikes,
  selectPointsOrderByTime,
  selectPointsByKeyword,
  selectPointsByKeywordOrderByLikes,
  selectPointsByKeywordOrderByTime,
  insertPoint,
  selectUserIdFromPoint,
  insertPointImg,
  deletePoint,
  insertPointLocation,
  updatePoint,
  selectMapMark,
  updatePointLocation,
  updatePointImg,
  deletePointImg,
};
