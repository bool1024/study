<font color=red>初步测试没问题，未完全测试</font>
```
package holiday;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

public class HolidayUtils {
	
	private static final SimpleDateFormat FORMAT = new SimpleDateFormat("yyyy-MM-dd");
	
	private static Map<String, Map<String, HashSet<String>>> map = new HashMap<String, Map<String, HashSet<String>>>();
	
	private static HolidayUtils instance = new HolidayUtils();
	
	//内部初始化时直接加载xml配置信息
	private HolidayUtils(){
		//parseXMLByDOM();
		parseXMLBySAX();
	}
	
	public static HolidayUtils getInstance(){
		return instance;
	}
	
	public Map<String, Map<String, HashSet<String>>> getHolidaysMap(){
		return map;
	}
	
	//获取两个时间之间的工作日天数
	public Integer getDays(Date start, Date end){
		return queryDays(start, end);
	}
	
	//获取两个时间之间的工作日天数，若日期格式化失败，则返回null
	public Integer getDays(String start, String end){
		try {
			return queryDays(FORMAT.parse(start), FORMAT.parse(end));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	private Integer queryDays(Date start, Date end){
		String begin = FORMAT.format(start);
		String finish = FORMAT.format(end);
		if(begin.compareTo(finish) > 0){
			//log.error("结束时间不能早于开始时间!");
			return null;
		}else if(begin.compareTo(finish) == 0){
			return 0;
		}else{
			int i = 0;
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(start);
			while(FORMAT.format(calendar.getTime()).compareTo(finish) != 0){
				if(isWorkday(calendar.getTime())){
					i++;
				}
				calendar.add(Calendar.DAY_OF_YEAR, 1);
			}
			return i;
		}
	}
	
	public Date getEndDate(Date start, int days){
		return getEndDateCal(start, days);
	}
	
	public Date getEndDate(String start, int days){
		try {
			return getEndDateCal(FORMAT.parse(start), days);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	private Date getEndDateCal(Date start, int days){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(start);
		if(days == 0){
			return start;
		}else if (days < 0){
			while (days != 0){
				calendar.add(Calendar.DAY_OF_YEAR, -1);
				if(isWorkday(calendar.getTime())){
					days++;
				}
			}
			return calendar.getTime();
		}else {
			while(days != 0){
				calendar.add(Calendar.DAY_OF_YEAR, 1);
				if(isWorkday(calendar.getTime())){
					days--;
				}
			}
			return calendar.getTime();
		}
	}
	
	//判断某个日期是否是工作日
	public boolean isWorkday(Date date){
		return isWorkdayCheck(date);
	}
	
	//判断某个日期是否是工作日
	//参数为string时若格式化日期失败返回null
	public Boolean isWorkday(String date){
		try {
			return isWorkdayCheck(FORMAT.parse(date));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	private boolean isWorkdayCheck(Date date){
		String dateStr = FORMAT.format(date);
		String year = dateStr.substring(0, 4);
		String monthDay = dateStr.substring(5, dateStr.length());
		
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int weekOfDay = calendar.get(Calendar.DAY_OF_WEEK);
		//周末
		if(weekOfDay == 7 || weekOfDay == 1){
			//判断是不是补班
			return isContains(year, "workday", monthDay) ? true : false;
		}else{ //周一到周五
			//判断是否节假日
			return isContains(year, "holiday", monthDay) ? false : true;
		}
	}
	
	private boolean isContains(String year, String type, String monthDay){
		boolean flag = false;
		if(map.containsKey(year)){
			Map<String, HashSet<String>> monthDayMap = map.get(year);
			if(monthDayMap.containsKey(type)){
				HashSet<String> monthDaySet = monthDayMap.get(type);
				if(monthDaySet.contains(monthDay)){
					flag = true;
				}
			}
		}
		return flag;
	}
	
	
	//java自带的DOM实现
	private void parseXMLByDOM(){
		try {
			//获取jaxp工厂
			DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
			//获取解析器
			DocumentBuilder builder = builderFactory.newDocumentBuilder();
			//用解析器加载xml文档 ->Document
			Document document = builder.parse(new File("src/holidays.xml"));
			//Element root = document.getDocumentElement();
			NodeList nodeList = document.getElementsByTagName("year");
			for(int i = 0; i < nodeList.getLength(); i++){
				Element yearNode = (Element)nodeList.item(i);
				String year = yearNode.getAttribute("value");
				NodeList childNodes = yearNode.getChildNodes();
				Map<String, HashSet<String>> daysMap = new HashMap<String, HashSet<String>>();
				for(int j = 0; j < childNodes.getLength(); j++){
					Node node = childNodes.item(j);
					//判断子节点是不是element元素类型（因为遍历过程中会遍历出空格和换行）
					if(node.getNodeType() == Node.ELEMENT_NODE){
						Element child = (Element) node;
						//此处用child.getNodeName()也行
						daysMap.put(node.getNodeName(), new HashSet<String>(Arrays.asList(child.getAttribute("days").split(","))));
						//注释代码可以解析<name>test</name>中的test值
						/*if("test".equals(child.getNodeName())){
							System.out.println(child.getTextContent());
						}*/
					}
				}
				map.put(year, daysMap);
			}
		} catch (ParserConfigurationException e) {
			e.printStackTrace();
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	//java自带的SAX解析
	private void parseXMLBySAX(){
		//1.获取解析器工程
		SAXParserFactory factory = SAXParserFactory.newInstance();
		try {
			//2.获取解析器
			SAXParser parser = factory.newSAXParser();
			//3.解析文档
			parser.parse(new File("src/holidays.xml"), new SAXHandle());
		} catch (ParserConfigurationException e) {
			e.printStackTrace();
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	//private 不能被外部HolidayUtils.getInstance().new SAXHandle()调用
	private class SAXHandle extends DefaultHandler{
		
		private String year = "";
		
		//文档开始解析
		@Override
		public void startDocument() throws SAXException {
			System.out.println("文档开始解析");
		}
		
		//遇到元素开始解析，第三个参数时读取到的元素名称，第四个参数时读取到的元素的属性集
		@Override
		public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
			System.out.println(qName + "元素开始解析");
			Map<String, HashSet<String>> daysMap = new HashMap<String, HashSet<String>>();
			if("year".equals(qName)){
				year = attributes.getValue("value");
			}
			if("holiday".equals(qName) || "workday".equals(qName)){
				//因为是按顺序读取，所以需要用到父节点信息的时候可以提前把父节点中的value属性放到一个全局变量中
				daysMap.put(qName, new HashSet<String>(Arrays.asList(attributes.getValue("days").split(","))));
				if(map.containsKey(year)){
					Map<String, HashSet<String>> exist = map.get(year);
					daysMap.putAll(exist);
				}
				map.put(year, daysMap);
			}
		}
		
		//遇到文本开始解析，在xml文件里随便写一段不包含标签的文字则会走此方法
		@Override
		public void characters(char[] ch, int start, int length) throws SAXException {
			String str = new String(ch, start, length).trim();
			if(str.length() > 0){
				System.out.println(str);
			}
		}
		
		//元素解析结束
		@Override
		public void endElement(String uri, String localName, String qName) throws SAXException {
			System.out.println(qName + "元素解析结束");
		}
		
		//文档结束触发
		@Override
		public void endDocument() throws SAXException {
			System.out.println("文档解析结束");
		}
	}
}

```

```
<?xml version="1.0" encoding="UTF-8"?>
<root>
	<year value="2017">
		<!-- holiday节假日，有周末的可填可不填，workday补班 -->
		<holiday days="01-02,01-03,01-23,01-24,01-25,01-26,01-27,04-02,04-03,04-04,04-30,05-01,06-22,10-01,10-02,10-03,10-04,10-05"/>
		<workday days="01-21,01-29,03-31,04-01,04-28,09-29"/>
	</year>
	<year value="2018">
		<holiday days="05-22,05-23"/>
		<workday days="01-21,01-29,03-31,04-01,04-28,09-29"/>
	</year>
</root>
```
