#GPS模擬器
##描述
* 建立Google Map網頁，模擬救護車 GPS訊號。
* 路線規劃

###被動
* 使用 google map api，圈選出固定範圍。
* 在範圍中可以打上圖標[(參考)](https://developers.google.com/maps/documentation/javascript/markers?hl=zh-tw)，代表救護車 ＆ 紅綠燈

###主動
* 在範圍中可以規劃路線[(參考)](https://developers.google.com/maps/documentation/javascript/directions?hl=zh-tw#DirectionsRequests)
* 傳送救護車模擬 ＧＰＳ訊號給 *救護車WuClass*

##屬性
	var gps_signal = {xx.xx, yy.yy};
	var route_plan_list = {xx,xx,xx,xx};
	s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	s.bind(('xxx.xxx.xxx.xxx', xxxx)) //救護車WuClass IP & Port
	s.listen(1)
##方法
###被動
* void web_init()
* location mark\_traffic\_light_location() //初次init
* location mark\_ambulance_location() //初次init

###主動
* location moveable\_ambulance_marker()
* boolean send\_gps\_to_socket()
* boolean send\_route\_plan\_list\_to_socket()

***
#救護車WuClass
##描述
###被動
*	使用 *socket* 直接取得 ＧＰＳ訊號 ＆ **紅綠燈 list**
*	接收模擬器傳來的ＧＰＳ訊號
*	接收模擬器傳來的路徑規劃 **紅綠燈 list**

###主動
*	發送ＧＰＳ訊號給 **救護車 AWS** (依照 *refresh_rate*更新速度)
* 	發送 **紅綠燈 list** 給 **救護車 AWS** (只需要發送一次？如果照 *refresh_rate*好像太多次。或是改由 **救護車 AWS**規劃路徑？如何將**紅綠燈 list**傳送出去？)

##屬性
	<WuClass name="Ambulance" id="xxxx" virtual="true" type="soft">
		<!-- GPS訊號如果是 long不知道會怎樣-->
        <property name="gps_siganl" access="readwrite" datatype="short" default="0"/>
        <!-- datatype不知道要怎樣設，目前只有四種type:short,boolean,enum,refresh_rate -->
        <property name="route_plan_list" access="readwrite" datatype="?" default="?"/>
        <property name="refresh_rate" access="readwrite" datatype="refresh_rate" default="50"  />
    </WuClass>
##方法
###被動
*	將取得的 ＧＰＳ訊號，從 flow轉成 short (比例尺換算可以做這邊)

###主動
*	把換算完的 ＧＰＳ訊號傳出去
*  用 socket把 **紅綠燈 list**傳出去？

***
#救護車 AWS
##描述
專門用來發送 MQTT訊息到 AWS Server上。
###被動
*	接收從 **救護車WuClass**上得到的 ***ＧＰＳ訊號*** ＆ ***紅綠燈 list***

###主動
*	把接收到的內容，透過 MQTT傳送到 AWS Server上。在 AWS上看起來需要兩個 TOPIC *gps_signal* & **

####publish(topic, payload, QoS)

Description

		Publish a new message to the desired topic with QoS.
Syntax

* Publish a QoS0 message "myPayload" to topic "myToppic"
		
		myAWSIoTMQTTClient.publish("myTopic", "myPayload", 0)

* Publish a QoS1 message "myPayload2" to topic "myTopic/sub"

		myAWSIoTMQTTClient.publish("myTopic/sub", "myPayload", 1)

Parameters

* topic - Topic name to publish to.
* payload - Payload to publish.
* QoS - Quality of Service. Could be 0 or 1.

Returns

	True if the publish request has been sent to paho. False if the request did not reach paho.

##屬性
	
##方法
###被動

###主動
***
#紅綠燈
##描述
###被動

###主動

##屬性
	
##方法
###被動

###主動
***
#紅綠燈 AWS
##描述
###被動

###主動

##屬性
	
##方法
###被動

###主動
