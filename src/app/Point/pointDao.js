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


module.exports = {
    selectPointId,
};
