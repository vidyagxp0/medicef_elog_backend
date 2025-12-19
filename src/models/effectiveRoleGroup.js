const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const EffectiveRole = sequelize.define("EffectiveRole", {
  effectiveRole_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  effectiveRole: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

EffectiveRole.addHook("afterSync", async () => {
  try {
    const EffectiverolesCount = await EffectiveRole.count();
    if (EffectiverolesCount === 0) {
      await EffectiveRole.bulkCreate([
        { effectiveRole: "Originator" },
        { effectiveRole: "ProductionReviewer" },
        { effectiveRole: "QaReviwer" },
      ]);
      console.log("Effective Roles created");
    } else {
      console.log("Effective Roles already exist");
    }
  } catch (error) {
    console.error("Error creating effective roles:", error);
  }
});

module.exports = EffectiveRole;
