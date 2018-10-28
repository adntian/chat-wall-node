
function Criteria() {
    this.tableName = null;
    this.condition = null;
    this.params = null;
    this.limit = null;
    this.offset = null;
    this.group = null;
    this.order = null;
    this.count = false; //是否统计总数
}


module.exports = Criteria;

