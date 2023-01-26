// pointId 포인트 조회
async function selectPointId(connection, pointId) {
    const selectUserIdQuery = `
                 SELECT point_id, title 
                 FROM Points
                 WHERE point_id = ?;
                 `;
    const [pointRow] = await connection.query(selectUserIdQuery, pointId);
    return pointRow;
}

// 전체 포인트 조회
async function selectPoints(connection) {
    const selectPointsQuery = `
        select p.point_id as pointId, p.title, p.content, p.type, p.creature, p.date, p.location, count(upl.point_id) as likes, u.nickname, pointImageUrlList
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
        group by p.point_id
                 `;
    const [pointRow] = await connection.query(selectPointsQuery);
    return pointRow;
}

// 키워드 기반 포인트 조회
async function selectPointsByKeyword(connection, keywordParams) {
    const selectPointsByKeywordQuery = `
        select p.point_id as pointId, p.title, p.content, p.type, p.creature, p.date, p.location, count(upl.point_id) as likes, u.nickname, pointImageUrlList
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
        where p.title like concat('%', ? , '%')
           or p.content like concat('%', ?, '%')
           or p.type like concat('%', ?, '%')
           or p.creature like concat('%', ?, '%')
           or p.location like concat('%', ?, '%')
        group by p.point_id`;
    const [pointRowByKeyword] = await connection.query(selectPointsByKeywordQuery, keywordParams);
    return pointRowByKeyword;
}
async function insertPoint(connection, insertPointParams) {
    const insertPointQuery = `
    INSERT INTO Points(user_id, title, content, type, location, creature, date)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    const updatePointRow = await connection.query(insertPointQuery, insertPointParams);
    return updatePointRow[0];
}
async function selectUserIdFromPoint(connection, pointId) {
    const selectUserIdFromPointQuery = ` SELECT user_id
    FROM Points
    WHERE point_id = ?;`;
    const selectedUserIdRow = await connection.query(selectUserIdFromPointQuery, pointId);
    return selectedUserIdRow[0];
}


module.exports = {
    selectPointId,
    selectPoints,
    selectPointsByKeyword,
    insertPoint,
    selectUserIdFromPoint,
};