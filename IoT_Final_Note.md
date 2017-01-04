#裝置統計表
<table>
<tr><td>種類</td><td>個數/person</td><td>總數</td></tr>
<tr><td>Pi</td><td>1(TzuYu), </td><td></td></tr>
<tr><td>Edison</td><td>1(TzuYu), </td><td></td></tr>
<tr><td>燈條</td><td>1(TzuYu), </td><td></td></tr>
<tr><td>RGB LED</td><td>1(TzuYu), </td><td></td></tr>
</table>
#GPS模擬器
##描述
* 建立Google Map網頁，模擬救護車 *GPS訊號*，輸入*傷重等級*。
* 路線規劃。

###被動
* 使用 google map api，圈選出固定範圍。
* 在範圍中可以打上圖標[(參考)](https://developers.google.com/maps/documentation/javascript/markers?hl=zh-tw)，代表救護車 ＆ 紅綠燈。

###主動
* 在範圍中可以規劃路線[(參考)](https://developers.google.com/maps/documentation/javascript/directions?hl=zh-tw#DirectionsRequests)。
* 傳送救護車模擬 ＧＰＳ訊號給 *救護車WuClass*。

##屬性
	var gps_signal = {xx.xx, yy.yy};
	var route_plan_list = {xx,xx,xx,xx};
	var priority = xx;
	s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	s.bind(('xxx.xxx.xxx.xxx', xxxx)) //救護車WuClass IP & Port
	s.listen(1)
##方法
###被動
* **void** web_init()
* **location** mark\_traffic\_light_location() //初次init
	* 需要配合 deployee 時給的ID。
* **location** mark\_ambulance_location() //初次init

###主動
* **integer** input_priority()
* **location** moveable\_ambulance_marker()
* **boolean** send\_gps\_to_socket()
* **boolean** send\_route\_plan\_list\_to_socket()
	* 需要輸出 紅綠燈ID List
* **boolean** send\_priority\_to_socket()
* **locationList** recalculate\_rouote\_plan\_list()

***
#救護車WuClass
##描述
###被動
*	使用 *socket* 直接取得 ＧＰＳ訊號、傷重等級 ＆ 紅綠燈 List。

###主動
*	發送 *ＧＰＳ訊號* 給 **救護車 AWS** (依照 *refresh_rate*更新速度)。
* 	發送 *紅綠燈 List* 給 **救護車 AWS** (<span style="text-decoration:line-through;">只需要發送一次？</span>如果照 *refresh_rate*好像太多次。<span style="text-decoration:line-through;">或是改由 **救護車 AWS**規劃路徑？</span>如何將*紅綠燈 List*傳送出去？)。
*  發送 *傷重等級* 給 **救護車 AWS**。

##屬性
	<WuClass name="Ambulance" id="xxxx" virtual="true" type="soft">
		<!-- GPS訊號如果是 long不知道會怎樣-->
        <property name="gps_siganl" access="readwrite" datatype="short" default="0"/>
        <!-- datatype不知道要怎樣設，目前只有四種type:short,boolean,enum,refresh_rate -->
        <property name="route_plan_list" access="readwrite" datatype="?" default="?"/>
        <property name="priority" access="readwrite" datatype="short" default="0"/>
        <property name="refresh_rate" access="readwrite" datatype="refresh_rate" default="50"  />
    </WuClass>
##方法
###被動
*	將取得的 ＧＰＳ訊號，從 flow轉成 short (比例尺換算可以做這邊)。
*  get priority & route\_plan_list from GPS模擬器。

###主動
*	把換算完的 ＧＰＳ訊號、傷重等級傳出去。
*  用 socket把 *紅綠燈 List*傳出去？

***
#救護車 AWS
##描述
專門用來發送 MQTT訊息到 AWS Server上。
###被動
*	接收從 **救護車WuClass**上得到的 *ＧＰＳ訊號* 、 *紅綠燈 List* ＆ *傷重等級*。

###主動
*	把接收到的內容，透過 MQTT傳送到 AWS Server上。在 AWS上看起來需要三個 TOPIC <span style="color:red;b">**IotFinal**</span><span style="color:orange"> **gps** , **rpl** ＆ **priority**</span>。

####publish(topic, payload, QoS)

Description

		Publish a new message to the desired topic with QoS.
Syntax

* Publish a QoS0 message "gpsSignal" to topic "IotFinal/gps"
		
		myAWSIoTMQTTClient.publish("IotFinal/gps", "gpsSignal", 0);

* Publish a QoS1 message "routePlanList" to topic "IotFinal/rpl"

		myAWSIoTMQTTClient.publish("IotFinal/rpl", "routePlanList", 1);
* Publish a QoS1 message "priority" to topic "IotFinal/priority"

		myAWSIoTMQTTClient.publish("IotFinal/priority", "priority", 2);
		
Parameters

* topic - Topic name to publish to.
* payload - Payload to publish.
* QoS - Quality of Service. Could be 0 or 1.

Returns
	
	True if the publish request has been sent to paho. False if the request did not reach paho.

##屬性
	<WuClass name="Ambulance_AWS_Daemon" id="xxxx" virtual="true" type="soft">
        <property name="gps_siganl" access="readwrite" datatype="short" default="0"/>
        <property name="route_plan_list" access="readwrite" datatype="?" default="?"/>
        <property name="priority" access="readwrite" datatype="short" default="0"/>
        <property name="refresh_rate" access="readwrite" datatype="refresh_rate" default="50"  />
    </WuClass>
##方法
###被動
* get GPS, route\_plan_list & priority from WuKong.

###主動
* **boolean** sent\_gps\_to_aws()
* **boolean** sent\_route\_plan\_list\_to_aws()
* **boolean** sent\_priority\_to\_aws()

***
#紅綠燈 AWS
##描述
###被動
從 *AWS*上的 *SQS(IotFinal)*中，取得*ＧＰＳ訊號* 、 *紅綠燈 List* ＆ *傷重等級*。
###主動
傳送訊號給底下的 *紅綠燈WuClass* ，內容包括：

* **active_signal**:通知 *紅綠燈WuClass* 是否在 *route\_plan\_list*中。
* **gps**：救護車目前所在位置。
* **traffic_light_patten**:通知 *紅綠燈WuClass* 要使用何種模式。
* **priority**:傷重等級。

##屬性
	<WuClass name="Traffice_Light_AWS_Daemon" id="xxxx" virtual="true" type="soft">
        <property name="gps_siganl" access="readwrite" datatype="short" default="0"/>
        <property name="route_plan_list" access="readwrite" datatype="?" default="?"/>
		<property name="active_signal" access="readwrite" datatype="boolean" default="false"/>
		<property name="traffic_light_patten" access="readwrite" datatype="short" default="0"/>
		<property name="priority" access="readwrite" datatype="short" default="0"/>
        <property name="refresh_rate" access="readwrite" datatype="refresh_rate" default="50"  />
    </WuClass>
##方法
###被動
* get GPS、route\_plan_list & priority from AWS SQS.

###主動
* 依照 route\_plan_list 上所指定的 traffic\_light_id 通知該 ID 的 traffic\_light，並傳送 gps、patten & priority。
* 計算該使用何種 patten。

***
#紅綠燈
##描述
###被動
* 一般紅綠燈亮燈
* 從 *紅綠燈 AWS* 中取得 active_signal、gps、priority & traffic_light_patten。
* 在 deployee 時，需要給 UID。

###主動
變換燈號。
##屬性
	<WuClass name="Traffice_Light" id="xxxx" virtual="true" type="soft">
		<property name="active_signal" access="readwrite" datatype="boolean" default="false"/>
		<property name="traffic_light_patten" access="readwrite" datatype="short" default="0"/>
        <property name="priority" access="readwrite" datatype="short" default="0"/>
        <property name="refresh_rate" access="readwrite" datatype="refresh_rate" default="50"  />
    </WuClass>
##方法
###被動
* 一般紅綠燈亮燈：
	* 以十秒為間距，每個路口紅綠燈錯開。
	* 每個路口相互溝通？依照路口 ID奇偶數區分？直接依照縱橫區分？
* 依照 GPS訊號速率，計算出<span style="color:red">救護車時速</span>。
* get active_signal、gps & traffic_light_patten from *紅綠燈 AWS*。

###主動
* 依照 *gps 距離*，判斷何時需要變燈。
* 換燈 patten switch method
	* 判斷要亮哪個方向的綠燈。
	* 計算距離路口圓心半徑兩層距離，判斷要給哪邊救護車先行。
		* 依先到達最小變燈距離的救護車變燈號。	
		* 同時到達，*傷重程度*高優先。
		* 同時到達＋*傷重程度*相同，<span style="color:red">時速</span>快優先。
		* 第一台車離開後，判斷第二台車是否還需要變換燈號。
* 救護車離開後，將燈號還原。