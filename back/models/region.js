module.exports = (sequelize, DataTypes) => {
    const Region = sequelize.define('Region', {
        city:{
            type: DataTypes.STRING(100),
            allowNull:false
        },
        town:{
            type: DataTypes.STRING(100),
            allowNull:false
        }
    },{
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Region.associate = (db) => {
        db.Region.hasMany(db.User);
        db.Region.hasMany(db.Post);
    }

    return Region;
}