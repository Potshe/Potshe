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
        select p.title, p.content, p.type, p.creature, p.date, count(upl.point_id) as likes, u.nickname as userNickName, imgList
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
async function selectPointsByKeyword(connection, pointId) {
    const selectPointsByKeywordQuery = `
                 SELECT point_id, title 
                 FROM Points
                 WHERE point_id = ?;
                 `;
    const [pointRow] = await connection.query(selectUserIdQuery, pointId);
    return pointRow;
}


module.exports = {
    selectPointId,
    selectPoints,
    selectPointsByKeyword,
};
