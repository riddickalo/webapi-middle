import Alarm from './alarm.mjs';
import Nc_Info from './nc_info.mjs';
import Prod_Record from './prod_record.mjs';
import Maintain_Item from './maintain_item.mjs';
import Maintain_Record from './maintain_record.mjs';
import Setting from './setting.mjs';

// defining model associations is bi-directional
Nc_Info.hasMany(Maintain_Item, { foreignKey: 'nc_id' });
Nc_Info.hasMany(Maintain_Record, { foreignKey: 'nc_id' });

Alarm.belongsTo(Nc_Info, {
    foreignKey: 'nc_id',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});

Prod_Record.belongsTo(Nc_Info, {
    foreignKey: 'nc_id',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});

Maintain_Record.belongsTo(Nc_Info, {
    foreignKey: 'nc_id',
    onDelete: 'CASCADE',
});

Maintain_Item.belongsTo(Nc_Info, {
    foreignKey: 'nc_id',
    onDelete: 'CASCADE',
})