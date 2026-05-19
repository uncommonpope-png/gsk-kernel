module.exports = { skill_oracle };

function skill_oracle() {
  return {
    name: "Oracle",
    description: "Query Oracle databases and manage Oracle DB connections",
    when: "Running SQL queries against Oracle databases, managing schemas, DB administration",
    commands: {
      sqlplus: {
        connect: "sqlplus user/password@hostname:1521/service_name",
        runQuery: `sqlplus -S user/password@host:1521/svc << 'EOF'
SELECT table_name FROM user_tables;
EXIT;
EOF`,
        executeFile: "sqlplus user/password@host:1521/svc @script.sql",
        pipeQuery: `echo "SELECT COUNT(*) FROM orders;" | sqlplus -S user/pass@host:1521/svc`
      },
      python: {
        connect: `const oracledb = require('oracledb');
const conn = await oracledb.connect({ user: "user", password: "pass", dsn: "host:1521/svc" });
const result = await conn.execute("SELECT * FROM employees WHERE department_id = :dept", [10]);`,
        pattern: "oracledb.connect(user, password, dsn)"
      },
      sql: {
        listTables: "SELECT table_name FROM user_tables ORDER BY table_name;",
        tableStructure: "SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = 'MY_TABLE';",
        runningQueries: "SELECT sql_text, elapsed_time FROM v$sql WHERE elapsed_time > 1000000 ORDER BY elapsed_time DESC;"
      }
    },
    notes: [
      "DSN format: host:port/service_name",
      "Thin mode (oracledb): no Oracle client install needed",
      "Thick mode: requires Oracle Instant Client",
      "Use oracledb-thin for TypeScript/Deno support"
    ],
    alternatives: {
      local: ["SQLite for local dev", "PostgreSQL for cloud-native"],
      free: ["Oracle Express Edition (XE)", "oracledb npm package (free)"]
    }
  };
}