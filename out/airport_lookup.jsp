<%@ page contentType="application/json;charset=UTF-8" language="java" %>
<%@ page import="java.sql.*" %>
<%@ page import="javax.sql.*" %>
<%@ page import="javax.naming.*" %>
<%@ page import="org.json.*" %>

<%!
	public JSONArray convertToJSON(ResultSet resultSet) throws Exception {
		JSONArray jsonArray = new JSONArray();
		while (resultSet.next()) {
			JSONObject obj = new JSONObject();
			int total_rows = resultSet.getMetaData().getColumnCount();
			for (int i = 0; i < total_rows; i++) {
				obj.put(resultSet.getMetaData().getColumnLabel(i + 1)
						.toLowerCase(), resultSet.getObject(i + 1));
			}
			
			jsonArray.put(obj);
		}
		return jsonArray;
	}
%>

<%
	InitialContext initialContext = new InitialContext();
	Context environmentContext = (Context)initialContext.lookup("java:/comp/env");
	DataSource dataSource = (DataSource)environmentContext.lookup("jdbc/aviation");
	Connection conn = dataSource.getConnection();
	
	if (request.getParameter("query") != null && !request.getParameter("query").isEmpty()) {
		PreparedStatement statement = conn.prepareStatement("SELECT * FROM `airports` WHERE `name` LIKE ? OR `municipality` LIKE ? ORDER BY `name` ASC LIMIT 5");
		statement.setString(1, "%" + request.getParameter("query") + "%");
		statement.setString(2, "%" + request.getParameter("query") + "%");

		ResultSet results = statement.executeQuery();
		
		out.println(convertToJSON(results));
	} else {
		out.println("[]");
	}
	
	conn.close();
%>

