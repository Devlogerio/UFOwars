
///////////////////////////////////////////DataBase Ends/////////////////////////////////////////////////////
//Login: goldpriest/phoenix
//Data base name: ufowars
//collection names: accounts/progress
//var mongojs = require("mongojs");//database type
//var db = mongojs('localhost:27017/ufowars', ['accounts','progress']);//database login
//https://www.transparenttextures.com/ maps
//font Jokerman
//cheat 5000 score 09128573237091000713720912857323709100071372
///////////////////////////////////////////Server Ends///////////////////////////////////////////////////////
var express = require('express');		 //web info
var app = express();                     //web info
var serv = require('http').Server(app);  //web infovar DEBUG = false;//if it be false then no hacking will happen , but if true so you can debug by "\" in chat
app.get('/',function(req, res) {         //web info
    res.sendFile(__dirname + '/client/index.html');//where to intract
});
app.use('/client',express.static(__dirname + '/client'));//the client access files
serv.listen(process.env.PORT || 2000);//the port
console.log('server started');
var io = require('socket.io').listen(serv)//(serv,{});//this will say that we use sockets
var SOCKET_LIST = {};//list of online player
////////////////////////////////////////////////////////////////////////////////////////////////////////////




try
{

 
////////////////////////////////////////////////////Variables//////////////////////////////////////////////////////////
var teamSeprator = 2;
var stoneMinX = -15;
var stoneMaxX = 15;
var stoneMinY = -15;
var stoneMaxY = 15;
var giftsMinX = -15;
var giftsMaxX = 15;
var giftsMinY = -15;
var giftsMaxY = 15;
var stoneXYpersenage = 0.1;
var preStoneNumbers = 250;
var globalEarthHp = 3000;
var globalEarthSpdPercentage = 1;
var globalPlayerspdXYpersenage = 0.06;
var globalplayerHpMax = 500;
var mapXrange = 10000;
var mapYrange = 4000;
var oponnentSize = 40;
var globalBulletRatePersentage = 8;
var stonePushBackPersentage = 5;
var equaller = 0;
var giftsSuggests = [
'nothing','nothing',
'hp',
'nothing','nothing',
'shield',
'nothing','nothing',
'boost',
'nothing','nothing','nothing',
];
var randomColor = [
'#f73333',
'#e5f442',
'#41f4eb',
'#f44188',
'#f44141',
];
//'#3a270a',
//'#330815',
//'#10062d',
//'#113d08',
//'#5e5c04',
var rebelRespownY = [
150,
3850,
];
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
 

///////////////////////////////////////////Shared Entities//////////////////////////////////////////////// 
var Entity = function(){//these are shared between constructors
    var self = {
        x:randomNumberRange(1, mapXrange),      
        y:randomNumberRange(1, mapYrange),      
        spdX:0,     
        spdY:0,     
        cSpdX:0,     
        cSpdY:0,     
        id:"",    
        collision:false,              
    }
    self.update = function(){//update function
	if(!self.collision)
        self.updatePosition();
	else
        self.updateCollisionPosition(self.cSpdX,self.cSpdY);
    }
    self.updatePosition = function(){//update position function
			self.x += self.spdX;
			self.y += self.spdY;
    }
    self.updateCollisionPosition = function(spdX,spdY){//update position function
			self.x += spdX;
			self.y += spdY;
    }
    self.getDistance = function(pt){//this class will return the dictance between its own parent and given parent
        return Math.sqrt(Math.pow(self.x-pt.x,2) + Math.pow(self.y-pt.y,2));
    }
    return self;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////// 




/////////////////////////////////////////////////Players Object/////////////////////////////////////////////// 
var Player = function(id,name,party,role,team){//player constructor
    var self = Entity();
    self.id = id;
    self.name = name;//it has to be name of player
	self.role = role;
    self.pressingAttack = false;
    self.mouseAngle = 0;//angle of mouse depends on midle of screen
    self.maxSpd = 10;
	self.bulletSpd = 40;
	self.bulletRange = 20;
	self.bulletSize = 15;
	self.bulletPower = 1;
	self.mouseLock = false;
    self.hp = 10;
    self.isDead = false;
    self.hpMax = globalplayerHpMax;
	self.shield = false;
	self.boost = false;
    self.score = 0;
    self.update1Allow = true;
    self.update2Allow = false;
    self.update3Allow = false;
    self.update4Allow = false;
	self.updateRank = 0;
	self.playerspdXYpersenage = globalPlayerspdXYpersenage;
	self.mx = 0; //mouse x
	self.my = 0; //mouse y
	self.bulletRate = 0;
	self.BulletRatePersentage = globalBulletRatePersentage;
	self.ufo = role;
	self.bonus = "nothing";
	self.whoKilled = '';
	self.bonusIsEnable = false;
	self.party = team;
	self.statReset = function(){//this will reset stats of roles and teams
	
		if(self.role == 1)////////////////////// role tank
		{
			self.hpMax = 15;
			self.hp = self.hpMax;
			self.bulletPower = 1;
			self.playerspdXYpersenage = globalPlayerspdXYpersenage;
			self.BulletRatePersentage = 25;
			self.bulletSpd = 25;
			self.bulletSize = 15;
		}
		if(self.role == 2)////////////////////// role gunner
		{
			self.hpMax = 10;
			self.hp = self.hpMax;
			self.bulletPower = 0.7;
			self.playerspdXYpersenage = globalPlayerspdXYpersenage + 0.01;
			self.BulletRatePersentage = 8;
			self.bulletSpd = 40;
			self.bulletSize = 15;
		}
		if(self.role == 3)////////////////////// role cannon
		{
			self.hpMax = 20;
			self.hp = self.hpMax;
			self.bulletPower = 2;
			self.playerspdXYpersenage = globalPlayerspdXYpersenage - 0.03;
			self.BulletRatePersentage = 33;
			self.bulletSpd = 28;
			self.bulletSize = 15;
		}
		if(self.role == 4)////////////////////// role cannon
		{
			self.hpMax = 25;
			self.hp = self.hpMax;
			self.bulletPower = 4;
			self.playerspdXYpersenage = globalPlayerspdXYpersenage - 0.01;
			self.BulletRatePersentage = 40;
			self.bulletSpd = 28;
			self.bulletSize = 15;
		}
	}
	self.partyEqualer = function(){
		if(self.party == 0)
		{
			if(equaller % 2 == 0)////this will choose their team
			{
				self.party = 1;
				equaller ++;
			}
			else if(equaller % 2 == 1)////this will choose their team
			{
				self.party = 2;
				equaller ++;
			}
			else////this will choose their team
			{
				self.party = randomNumberRange(1, 2);
			}
		}
	}
	
	///////////////////////////////////////////////////Player spawn section
	self.spawn = function(){
		if(self.party == 1)//this will spawn player for first connection on Eprotetors team
		{
			self.x = Earth.list[1].x + randomNumberRange(150, 400);
			self.y = Earth.list[1].y + randomNumberRange(150, 400);
		}
		else//this will spawn player for first connection on Rebels team
		{
			self.x = Earth.list[2].x + randomNumberRange(150, 400);
			self.y = Earth.list[2].y + randomNumberRange(150, 400);
		}
		self.collisionBeforeSpawnCheck();//if its on a stone it resets
	}
	self.collisionBeforeSpawnCheck = function(){
        for(var i in Stone.list){ //check the colossion between player and stones
            var s = Stone.list[i];
            if(self.getDistance(s) < s.radius/1.3 + oponnentSize){
				self.spawn();
            }
        }
	}
	
	self.partyEqualer();
	self.statReset();//this will make statReset function happen
	self.spawn();//spawn the player
	///////////////////////////////////////////////////////////////////////////
	
	
	
	
	
    var super_update = self.update;//this will overwrite the update function in shared entity
    self.update = function(){//this will update speed and bullets before it shoots
        self.updateSpd();
        super_update();
		self.score = Math.round(self.score);//this will round the score
        if(self.pressingAttack){//shooting bullets
				self.bulletRate++//this is rate of bullets;                
				if(self.ufo == 1 || self.ufo == 2 || self.ufo == 3 || self.ufo == 4)//rank 0
				{              
					if(self.bulletRate % self.BulletRatePersentage == 0)//bullet rate%4 means shoots not like a rain
					{    
							self.shootBullet(self.mouseAngle); 
					}
				}    
				else if(self.ufo == "ufoCase1")//rank1 update 1
				{
					
					if(self.role == 1)//rank1 update 1 tank
					{
						for(var i = -1 ; i <= 1 ; i++)
						{
							if(i != 0)
							{
								if(self.bulletRate % self.BulletRatePersentage == 0)//bulletrate%4 means shoots not like a rain
								{    
									self.shootBullet(i * 1.5 + self.mouseAngle);
								}
							}
						}
					}
					if(self.role == 2)//rank1 update 1 gunner
					{
							if(self.bulletRate % 4 == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(self.mouseAngle);
							}
					}
					if(self.role == 3)//rank1 update 1 cannon
					{
						for(var i = -1 ; i <= 1 ; i++)
						{
							if(i != 0)
							{
								if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
								{    
									self.shootBullet(i * 6 + self.mouseAngle);
								}
							}
						}
					}
					if(self.role == 4)//rank1 update 1 cannon
					{
						if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
						{    
							self.shootBullet(self.mouseAngle);
						}
					}
				}     
				else if(self.ufo == "ufoCase1.1")//rank2 update 2
				{
					if(self.role == 1)//rank2 update 1 tank
					{
						for(var i = -1 ; i <= 1 ; i++)
						{
								if(self.bulletRate % self.BulletRatePersentage == 0)//bulletrate%4 means shoots not like a rain
								{    
									self.shootBullet(i * 1.5 + self.mouseAngle);
								}
						}
					}
					if(self.role == 2)//rank2 update 1 gunner
					{
							if(self.bulletRate % 2 == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(self.mouseAngle);
							}
					}
					if(self.role == 3)//rank2 update 1 cannon
					{
						if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 1)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
					}
					if(self.role == 4)//rank1 update 1 cannon
					{
						if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 1)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
					}
				}     
				else if(self.ufo == "ufoCase1.2")//rank3 update 3
				{
					if(self.role == 1)
					{
						for(var i = -2 ; i <= 2 ; i++)
						{
								if(self.bulletRate % self.BulletRatePersentage == 0)//bulletrate%4 means shoots not like a rain
								{    
									self.shootBullet(i * 1.5 + self.mouseAngle);
								}
						}
					}
					if(self.role == 2)
					{
							if(self.bulletRate % 1 == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(self.mouseAngle);
							}
					}
					if(self.role == 3)
					{
						if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 1)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 2)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
					}
					if(self.role == 4)//rank1 update 1 cannon
					{
						if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 1)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 2)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
					}
				}
				else if(self.ufo == "ufoCase1.3")//rank3 update 4
				{
					if(self.role == 1)
					{
						for(var i = -3 ; i <= 3 ; i++)
						{
								if(self.bulletRate % self.BulletRatePersentage == 0)//bulletrate%4 means shoots not like a rain
								{    
									self.shootBullet(i * 1.5 + self.mouseAngle);
								}
						}
					}
					if(self.role == 2)
					{
						for(var i = -1 ; i <= 1 ; i++)
						{
							if(i != 0)
							{
								if(self.bulletRate % 1 == 0)//bulletrate%4 means shoots not like a rain
								{    
									self.shootBullet(i * 8 + self.mouseAngle);
								}
							}
						}
					}
					if(self.role == 3)
					{
						if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 1)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 2)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 3)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
					}
					if(self.role == 4)//rank1 update 1 cannon
					{
						if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 2)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 4)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 6)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
					}
				}
				
				else if(self.ufo == "ufoCase2")//rank2 update 1
				{
					if(self.role == 1)//rank1 update 2 tank
					{
						if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 1)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
					}
					if(self.role == 2)//rank1 update 2 gunner
					{
							if(self.bulletRate % (self.BulletRatePersentage + 3) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(-0.5 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 1) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(0.5 + self.mouseAngle);
							}
					}
					if(self.role == 3)//rank1 update 2 cannon
					{
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(180 + self.mouseAngle);
							}
					}
					if(self.role == 4)//rank1 update 1 cannon
					{
						if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
					}
				}      
				else if(self.ufo == "ufoCase2.1")//rank2 update 2
				{
					if(self.role == 1)//rank2 update 2 tank
					{
						if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 1)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 2)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
					}
					if(self.role == 2)//rank2 update 2 gunner
					{
							if(self.bulletRate % (globalBulletRatePersentage + 2) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(3 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 4) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(2 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(1 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 8) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(-1 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 10) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(-2 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 12) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(-3 + self.mouseAngle);
							}
					}
					if(self.role == 3)//rank2 update 2 cannon
					{
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(180 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(90 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(270 + self.mouseAngle);
							}
					}
					if(self.role == 4)//rank1 update 1 cannon
					{
						if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 1)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
					}
				}      
				else if(self.ufo == "ufoCase2.2")//rank2 update 3
				{
					if(self.role == 1)
					{
						if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 1)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 2)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 3)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
					}
					if(self.role == 2)
					{
							if(self.bulletRate % (globalBulletRatePersentage + 2) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(6 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 4) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(5 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(4 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 8) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(3 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 10) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(2 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 12) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(1 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 14) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(-1 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 16) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(-2 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 18) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(-3 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 20) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(-4 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 22) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(-5 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 24) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(6 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(self.mouseAngle);
							}
					}
					if(self.role == 3)
					{
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 1)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(180 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 1)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(180 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(90 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 1)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(90 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(270 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 1)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(270 + self.mouseAngle);
							}
					}
					if(self.role == 4)//rank1 update 1 cannon
					{
						if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 1)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 2)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
					}
				}
				else if(self.ufo == "ufoCase2.3")//rank2 update 4
				{
					if(self.role == 1)
					{
						if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 1)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 2)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 3)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 4)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
						if(self.bulletRate % (self.BulletRatePersentage) == 5)//bulletrate%4 means shoots not like a rain
						{    
								self.shootBullet(self.mouseAngle);
						}
					}
					if(self.role == 2)
					{
							if(self.bulletRate % (globalBulletRatePersentage + 2) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(6 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 4) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(5 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(4 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 8) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(3 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 10) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(2 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 12) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(1 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 14) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(-1 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 16) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(-2 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 18) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(-3 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 18) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(-4 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 18) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(-5 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 18) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(-6 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 2) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(-7 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 4) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(-8 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(-9 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 8) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(-10 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 10) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(-11 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 12) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(-12 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 14) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(7 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 16) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(8 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 18) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(9 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 18) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(10 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 18) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(11 + self.mouseAngle);
							}
							if(self.bulletRate % (globalBulletRatePersentage + 18) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(12 + self.mouseAngle);
							}
					}
					if(self.role == 3)
					{
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 1)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 2)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(180 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 1)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(180 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 2)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(180 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(90 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 1)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(90 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 2)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(90 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(270 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 1)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(270 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 2)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(270 + self.mouseAngle);
							}
					}
					if(self.role == 4)//rank1 update 1 cannon
					{
						for(var i = -1 ; i <= 1 ; i++)
						{
								if(self.bulletRate % self.BulletRatePersentage == 0)//bulletrate%4 means shoots not like a rain
								{    
									self.shootBullet(i * 10 + self.mouseAngle);
								}
								if(self.bulletRate % self.BulletRatePersentage == 1)//bulletrate%4 means shoots not like a rain
								{    
									self.shootBullet(i * 10 + self.mouseAngle);
								}
								if(self.bulletRate % self.BulletRatePersentage == 2)//bulletrate%4 means shoots not like a rain
								{    
									self.shootBullet(i * 10 + self.mouseAngle);
								}
						}
					}
				}		
				
				
				else if(self.ufo == "ufoCase3")//rank3 update 1
				{
					if(self.role == 1)//rank1 update 3 tank
					{
						for(var i = 0 ; i < 2 ; i++)
						{
							if(self.bulletRate % (self.BulletRatePersentage + 4) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(i * 180 + self.mouseAngle);
							}
						}
					}
					if(self.role == 2)//rank1 update 3 gunner
					{
						for(var i = -2 ; i <= 2 ; i++)
						{
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(i * 10 + self.mouseAngle);
							}
						}
					}
					if(self.role == 3)//rank1 update 3 cannon
					{
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(90 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(270 + self.mouseAngle);
							}
					}
					if(self.role == 4)//rank1 update 2 cannon
					{
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								if(self.hp < self.hpMax - self.bulletPower)
								self.hp += self.bulletPower;
								self.shootBullet(self.mouseAngle);
							}
					}
				} 
				else if(self.ufo == "ufoCase3.1")//rank3 update 2
				{
					if(self.role == 1)//rank2 update 3 tank
					{
						for(var i = 0 ; i < 2 ; i++)
						{
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(180 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(358 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(2 + self.mouseAngle);
							}
						}
					}
					if(self.role == 2)//rank2 update 3 gunner
					{
						for(var i = -5 ; i <= 5 ; i++)
						{
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(i * 10 + self.mouseAngle);
							}
						}
					}
					if(self.role == 3)//rank2 update 3 cannon
					{
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(88 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(268 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(93 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(272 + self.mouseAngle);
							}
					}
					if(self.role == 4)//rank1 update 2 cannon
					{
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{   
								if(self.hp < self.hpMax - self.bulletPower)
								self.hp += self.bulletPower; 
								self.shootBullet(self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(180 + self.mouseAngle);
							}
					}
				}    
				else if(self.ufo == "ufoCase3.2")//rank3 update 3
				{
					if(self.role == 1)
					{
						for(var i = 0 ; i < 2 ; i++)
						{
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(178 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(182 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(358 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(2 + self.mouseAngle);
							}
						}
					}
					if(self.role == 2)
					{
						for(var i = -10 ; i <= 10 ; i++)
						{
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(i * 10 + self.mouseAngle);
							}
						}
					}
					if(self.role == 3)
					{
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(86 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(90 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(94 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(266 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(270 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(274 + self.mouseAngle);
							}
					}
					if(self.role == 4)//rank2 update 2 cannon
					{
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								if(self.hp < self.hpMax - self.bulletPower)
								self.hp += self.bulletPower;
								self.shootBullet(self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(180 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(90 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(270 + self.mouseAngle);
							}
					}
				}    
				else if(self.ufo == "ufoCase3.3")//rank3 update 4
				{
					if(self.role == 1)
					{
						for(var i = 0 ; i < 2 ; i++)
						{
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(178 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(180 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(182 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(356 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(358 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(2 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
									self.shootBullet(4 + self.mouseAngle);
							}
						}
					}
					if(self.role == 2)
					{
						for(var i = -15 ; i <= 15 ; i++)
						{
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(i * 10 + self.mouseAngle);
							}
						}
					}
					if(self.role == 3)
					{
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(82 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(86 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(90 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(94 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(98 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(262 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(266 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(270 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(274 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage + 6) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(278 + self.mouseAngle);
							}
					}
					if(self.role == 4)//rank2 update 2 cannon
					{
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								if(self.hp < self.hpMax - self.bulletPower)
								self.hp += (self.bulletPower*2);
								self.shootBullet(self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(180 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(145 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(45 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(90 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(315 + self.mouseAngle);
							}
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(235 + self.mouseAngle);
							} 
							if(self.bulletRate % (self.BulletRatePersentage) == 0)//bulletrate%4 means shoots not like a rain
							{    
								self.shootBullet(270 + self.mouseAngle);
							} 
					}
				}   
				
				
				
			}                                           
        }     
		
    self.shootBullet = function(angle){  //creating bullets with the angle of mouse
        var b = Bullet(self.id,angle,self.party);
        b.x = self.x;//start x point of bullet
        b.y = self.y;//start y point of bullet
    }
   
    self.updateSpd = function(){//this class will update the speed of player
	if(self.mouseLock == false)
	{
		self.spdX = (self.mx)*self.playerspdXYpersenage;  //update speed depending of distance from mouse and player
		self.spdY = (self.my)*self.playerspdXYpersenage;  //update speed depending of distance from mouse and player
	}
	else
	{
		self.spdX = 0;
		self.spdY = 0;
	}
	if(self.x > mapXrange || self.x < 0 || self.y > mapYrange || self.y < 0){//if out of map so player hp reduces
				self.hp -= self.hpMax/100;
				self.remove();
	}
	
	
			
			
			
        for(var i in Stone.list){ //check the colossion between player and stones
            var s = Stone.list[i];
            if(self.getDistance(s) < s.radius/1.3 + oponnentSize){
				if(self.shield == false)
				self.hp -= self.hpMax/self.hpMax/1.5;
                self.score += s.score;
				self.cSpdX = -self.spdX/2;
				self.cSpdY = -self.spdY/2;
				self.collision = true;
				self.mx = 0;
				self.my = 0;
				self.collisionEnding();
				s.delete();
				self.remove();
            }
        }
		
        for(var i in Earth.list){ //check the colossion between player and stones
            var e = Earth.list[i];
            if(self.getDistance(e) < e.radius/1.1 + oponnentSize){
				//e.hp -= 1;
				//e.radius -= 1;
				if(self.shield == false && self.party !== e.id)
				{
					self.hp -= 1;
					self.cSpdX = -self.spdX;
					self.cSpdY = -self.spdY;
					self.collision = true;
					self.mx = 0;
					self.my = 0;
					self.collisionEnding();
					self.remove();
				}
				
            }
        }
		
        for(var i in Player.list){	//check the collision between player and other players
           var p = Player.list[i];
		   var oSize = oponnentSize;
		   if(self.shield == true)
			   oSize = oSize*2;
           if(self.getDistance(p) < oSize && p.id != self.id && self.party != p.party){
				p.cSpdX = self.spdX;
				p.cSpdY = self.spdY;
				self.collision = true;
				
				self.collisionEnding();

           }
       }
	   	
        for(var i in Gift.list){ //check the colossion between player and stones
            var g = Gift.list[i];
            if(self.getDistance(g) < g.radius + oponnentSize && self.bonus == "nothing"){
				if(g.contains !== "nothing")
				self.bonus = g.contains;
				g.delete();
            }
        }
	   
	   
	   self.checkAndUpdateRank();
	   
	   
    }//end of update function
   
	self.collisionEnding = function(){//this function will set collision to false when collision is true
			setTimeout(function(){ 
				self.collision = false;
			}, 500);
	}
   
   self.checkAndUpdateRank = function(){//this will update the player rank by its scrore
	    if(self.score >= 100 && self.update1Allow == true)//here we update the player ufo // && self.score <= 40
		{
			self.updateRank = 1;
		}
	    else if(self.score >= 600 && self.update2Allow == true)//here we update the player ufo // && self.score <= 40
		{
			self.updateRank = 2;
		}
	    else if(self.score >= 2000 && self.update3Allow == true)//here we update the player ufo // && self.score <= 40
		{
			self.updateRank = 3;
		}
	    else if(self.score >= 5000 && self.update4Allow == true)//here we update the player ufo // && self.score <= 40
		{
			self.updateRank = 4;
		}
		else
		{
			self.updateRank = 0;
		}//update player ufo ends here
   }
   
   self.ufoUpdate = function(ufoCase){//ufo update function to change the style of current ufo to wanted ufo start
		if(self.updateRank == 1 && self.update1Allow == true)//if rank = 1
		{
			if(self.role == 1)//stats for rank1 tank
			{
				self.bulletSpd = 28;
				self.bulletRange = 24;
				self.bulletPower = 1.4;
				self.hp = self.hpMax;
			}
			if(self.role == 2)//stats for rank1 gunner
			{
				self.bulletSpd = 40;
				self.bulletRange = 20;
				self.bulletPower = 0.7;
				self.playerspdXYpersenage += 0.005;
				self.hp = self.hpMax;
			}
			if(self.role == 3)//stats for rank1 cannon
			{
				self.bulletSpd = 23;
				self.bulletRange = 24;
				self.bulletPower = 3;
				self.hp = self.hpMax;
			}
			if(self.role == 4)//stats for rank1 bully
			{
				if(ufoCase == 1)
				{
					self.bulletSpd = 0;
					self.bulletRange = 200;
					self.bulletPower = 8;
				}
				if(ufoCase == 2)
				{
					self.hpMax = 30;
					self.bulletSpd = 18;
					self.bulletRange = 10;
					self.bulletPower = 0;
					self.bulletSize = 25;
				}
				if(ufoCase == 3)
				{
					self.bulletSpd = 23;
					self.bulletRange = 23;
					self.bulletPower = 1;
				}
				self.hp = self.hpMax;
			}
			if(ufoCase == 1)//rank 1 tank
			{
				self.ufo = "ufoCase1";
			}
			else if(ufoCase == 2)//rank 1 gunner
			{
				self.ufo = "ufoCase2";
			}
			else if(ufoCase == 3)//rank 1 cannon
			{
				self.ufo = "ufoCase3";
			}
			self.updateRank = 0;
			self.update1Allow = false;
			self.update2Allow = true;
		}
		else if(self.updateRank == 2 && self.update2Allow == true)//if rank = 2
		{
				if(self.role == 1)//stats for rank 2 tank
				{
					self.hpMax += 10;
					self.hp = self.hpMax;
				}
				if(self.role == 2)//stats for rank 2 gunner
				{
					self.bulletRange = 12;
					self.hpMax += 5;
					self.hp = self.hpMax;
				}
				if(self.role == 3)//stats for rank 2 cannon
				{
					self.hpMax += 15;
					self.hp = self.hpMax;
				}
				if(self.role == 4)//stats for rank 2 bully
				{
					if(ufoCase == 1)
					{
						self.hpMax = 30;
						self.bulletSpd = 0;
						self.bulletRange = 250;
						self.bulletPower = 10;
						self.hp = self.hpMax;
						self.bulletSize = 15;
						self.BulletRatePersentage = 40;
					}
					if(ufoCase == 2)
					{
						self.hpMax = 35;
						self.bulletSpd = 18;
						self.bulletPower = 0;
						self.hp = self.hpMax;
						self.bulletRange = 15;
						self.bulletSize = 25;
						self.BulletRatePersentage = 35;
					}
					if(ufoCase == 3)
					{
						self.hpMax = 25;
						self.bulletSpd = 23;
						self.bulletRange = 23;
						self.bulletPower = 2;
						self.bulletSize = 15;
						self.BulletRatePersentage = 40;
					}
				}
			if(ufoCase == 1)//rank 2 tank
				self.ufo = "ufoCase1.1";
			else if(ufoCase == 2)//rank 2 gunner
				self.ufo = "ufoCase2.1";
			else if(ufoCase == 3)//rank 2 cannon
				self.ufo = "ufoCase3.1";
			self.updateRank = 0;
			self.update2Allow = false;
			self.update3Allow = true;
		}
		else if(self.updateRank == 3 && self.update3Allow == true)//if rank = 3
		{
				if(self.role == 1)//stats for rank 3 tank
				{
					self.playerspdXYpersenage = globalPlayerspdXYpersenage - 0.02;
					//self.bulletRate = 2
					//self.hpMax = 15;
					self.bulletSpd = 33;
					self.bulletRange = 24;
					//self.bulletSize
					self.bulletPower = 1.2;
				}
				if(self.role == 2)//stats for rank 3 gunner
				{
					self.playerspdXYpersenage = globalPlayerspdXYpersenage + 0.03;
					//self.bulletRate = 2
					//self.hpMax = 15;
					self.bulletSpd = 40;
					self.bulletRange = 15;
					//self.bulletSize
					self.bulletPower = 0.3;
				}
				if(self.role == 3)//stats for rank 3 cannon
				{
					self.playerspdXYpersenage = globalPlayerspdXYpersenage - 0.03;
					//self.bulletRate = 2
					//self.hpMax = 15;
					self.bulletSpd = 20;
					self.bulletRange = 26;
					//self.bulletSize
					self.bulletPower = 5;
				}
				if(self.role == 4)//stats for rank 2 bully
				{
					if(ufoCase == 1)
					{
						self.bulletSpd = 0;
						self.bulletRange = 300;
						self.hpMax = 30;
						self.hp = self.hpMax;
						self.bulletPower = 12;
						self.playerspdXYpersenage += 0.01;
						self.bulletSize = 15;
						self.BulletRatePersentage = 40;
					}
					if(ufoCase == 2)
					{
						self.hpMax = 40;
						self.bulletSpd = 20;
						self.bulletPower = 0;
						self.hp = self.hpMax;
						self.bulletRange = 20;
						self.bulletSize = 25;
						self.BulletRatePersentage = 30;
					}
					if(ufoCase == 3)
					{
						self.hpMax = 30;
						self.bulletSpd = 23;
						self.hp = self.hpMax;
						self.bulletRange = 23;
						self.bulletPower = 4;
						self.bulletSize = 15;
						self.BulletRatePersentage = 40;
					}
				}
			if(ufoCase == 1)//rank 3 tank
				self.ufo = "ufoCase1.2";
			else if(ufoCase == 2)//rank 3 gunner
				self.ufo = "ufoCase2.2";
			else if(ufoCase == 3)//rank 3 cannon
				self.ufo = "ufoCase3.2";
			self.updateRank = 0;
			self.update3Allow = false;
			self.update4Allow = true;
		}
		else if(self.updateRank == 4 && self.update4Allow == true)//if rank = 4
		{
				if(self.role == 1)//stats for rank 3 tank
				{
					self.hpMax += 20;
					self.hp = self.hpMax;
				}
				if(self.role == 2)//stats for rank 3 gunner
				{
					self.hpMax += 20;
					self.hp = self.hpMax;
				}
				if(self.role == 3)//stats for rank 3 cannon
				{
					self.hpMax += 20;
					self.hp = self.hpMax;
				}
				if(self.role == 4)//stats for rank 2 bully
				{
					if(ufoCase == 1)
					{
						self.bulletSpd = 0;
						self.bulletRange = 300;
						self.hpMax = 50;
						self.hp = self.hpMax;
						self.bulletPower = 12;
						self.playerspdXYpersenage += 0.01;
						self.bulletSize = 15;
						self.BulletRatePersentage = 40;
					}
					if(ufoCase == 2)
					{
						self.hpMax = 60;
						self.bulletSpd = 20;
						self.bulletPower = 0;
						self.hp = self.hpMax;
						self.bulletRange = 20;
						self.bulletSize = 25;
						self.BulletRatePersentage = 30;
					}
					if(ufoCase == 3)
					{
						self.hpMax = 50;
						self.bulletSpd = 23;
						self.hp = self.hpMax;
						self.bulletRange = 23;
						self.bulletPower = 4;
						self.bulletSize = 15;
						self.BulletRatePersentage = 40;
					}
				}
			if(ufoCase == 1)//rank 3 tank
				self.ufo = "ufoCase1.3";
			else if(ufoCase == 2)//rank 3 gunner
				self.ufo = "ufoCase2.3";
			else if(ufoCase == 3)//rank 3 cannon
				self.ufo = "ufoCase3.3";
			self.updateRank = 0;
			self.update4Allow = false;
		}
   }//ufo update function to change the style of current ufo to wanted ufo ends herre
   
   self.bonusUse = function(state){//this will say what bonus its using
		if(self.bonus == "hp" && state == true)//uses hp
		{
			self.hp = self.hpMax;
			self.bonus = "nothing";
		}
		else if(self.bonus == "shield" && state == true)//uses shield
		{
			self.shield = true;
			self.bonusIsEnable = true;
			setTimeout(function(){ 
				self.shield = false;
				self.bonusIsEnable = false;
				self.bonus = "nothing";
			}, 10000);//shield ends here
		}
		else if(self.bonus == "boost" && state == true)//uses boost
		{
			var beforSpd = self.playerspdXYpersenage;
				self.playerspdXYpersenage = globalPlayerspdXYpersenage * 1.5;
				self.bonusIsEnable = true;
				setTimeout(function(){ 
				self.boost = false;
				self.bonusIsEnable = false;
				self.playerspdXYpersenage = beforSpd;
				self.bonus = "nothing";
			}, 5000);//boost ends here
		}
   }
   
   self.remove = function(isReset){//removes player after each dying and round ending
               if(self.hp <= 0){//after dying
				   self.statReset();
                   self.isDead = true; 
                   self.ufo = self.role;
				   self.update1Allow = true;
				   self.update2Allow = false;
				   self.update3Allow = false;
				   self.update4Allow = false;
                   self.score = self.score/1.5;
                   self.hp = self.hpMax;
				   self.spawn();
				   self.bonus = "shield";
				   self.bonusUse(true);
				   self.mx = 0;
				   self.my = 0;
				   self.mouseLock = true;
					setTimeout(function(){ 
						self.isDead = false; 
					}, 1000);                           
               } 
			   
				if(isReset == true)//if round is finished
				{
				   self.statReset();
				   self.partyEqualer();
                   //self.isDead = false; 
                   self.ufo = self.role;
				   self.update1Allow = true;
				   self.update2Allow = false;
				   self.update3Allow = false;
				   self.update4Allow = false;
				   self.mx = 0;
				   self.my = 0;
				   self.mouseLock = true;
                   //self.score = 0;
                   self.hp = self.hpMax;
				   self.spawn();
				   self.bonus = "shield";
				   self.bonusUse(true);
				}
   }
   
   
    self.getInitPack = function(){//this is the package which will be send to each player who connects (only once)
        return {
            id:self.id,
            name:self.name,
			party:self.party,
			role:self.role,
            x:self.x,
            y:self.y,  
            hp:self.hp,
            hpMax:self.hpMax,
            score:self.score,
			ufo:self.ufo,
        };     
    }
    self.getUpdatePack = function(){//this is the package which will be send to each player who is connected (every second)
        return {
            id:self.id,
            name:self.name,
            role:self.role,
            x:self.x,
            y:self.y,
            hp:self.hp,
            hpMax:self.hpMax,
            score:self.score,
			angle:self.mouseAngle,
			ufo:self.ufo,
			rank:self.updateRank,
			update1Allow:self.update1Allow,
			update2Allow:self.update2Allow,
			update3Allow:self.update3Allow,
			bonus:self.bonus,
			bonusIsEnable:self.bonusIsEnable,
            isDead:self.isDead,
            party:self.party,
			whoKilled:self.whoKilled,
        }  
    }
   
    Player.list[id] = self;//fill the playerlist by id to created self
   
    initPack.player.push(self.getInitPack()); //push new player into initpack
    return self;//return created self
}
Player.list = {};//this is the list of players

Player.getAllInitPack = function(){//this function will pet all initpacks inside players list and return them
    var players = [];
    for(var i in Player.list)
        players.push(Player.list[i].getInitPack());
    return players;
}

Player.onConnect = function(socket){ //player on connect function which will stay On untill player disconnects
  try{
	var player = Player(socket.id,socket.name,socket.party,socket.role,socket.team);
	}
	catch(err)
	{
		console.log("error in creating player on connect");
	}
	//player.name = socket.name;
    socket.on('mouseAction',function(data){//this will finds if player mouse is clicked or not
        if(data.inputId === 'attack')
            player.pressingAttack = data.state;
        else if(data.inputId === 'mouseAngle'){
			
			var x = -data.width/2 + data.mouseX;       //you might need to transfer these codes to server
			var y = -data.height/2 + data.mouseY;      //you might need to transfer these codes to server
			var angle = Math.atan2(y,x) / Math.PI * 180;   //you might need to transfer these codes to server
			player.mouseAngle = angle;
			var theR = 180;
			var theMinR = 50;
			if(data.mouseX < data.width/2+theMinR &&  data.mouseX > data.width/2-theMinR&&data.mouseY < data.height/2+theMinR && data.mouseY > data.height/2-theMinR)
			{
				player.mx = 0;
				player.my = 0;
			}
			else if(data.mouseX < data.width/2+theR &&  data.mouseX > data.width/2-theR && data.mouseY < data.height/2+theR && data.mouseY > data.height/2-theR)
			{
				player.mx = x;
				player.my = y;
			}
			else
			{
				player.mx = theR*Math.cos(Math.atan2(y,x));
				player.my = theR*Math.sin(Math.atan2(y,x));
			}
		}
    });
	socket.on('ufoUpdate',function(data){//this will find out what kind of ufo player has choosed
		player.ufoUpdate(data.ufo);
    });
    socket.on('bonusUse',function(data){//this will find out if player wants a boost
		player.bonusUse(data.state);
    });   
	
	try
	{
	socket.emit('init',{ //this will send the initpack of everything to all players
			selfId:socket.id,
			selfParty:socket.party,
			player:Player.getAllInitPack(),
			bullet:Bullet.getAllInitPack(),
			stone:Stone.getAllInitPack(),
			earth:Earth.getAllInitPack(),
    })
	}
	catch(err)
	{
		console.log("error in socket init");
	}
}
Player.onDisconnect = function(socket){//this is what will hapen if a player disconnects
    delete Player.list[socket.id];
    removePack.player.push(socket.id);
}
Player.update = function(){//this is what will happen every second
    var pack = [];
    for(var i in Player.list){
        var player = Player.list[i];
        player.update();
        pack.push(player.getUpdatePack());    
		player.whoKilled = '';//this will clear player.who killed after only one pushed update pack
    }
    return pack;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
 
 
/////////////////////////////////////////////////Bullets Object/////////////////////////////////////////////// 

var Bullet = function(parent,angle,party){//bullet constructor
    var self = Entity();//get shared entities
    self.parent = parent;
    self.id = Math.random();
	self.party = party;
	self.bulletSpd = Player.list[self.parent].bulletSpd;
    self.bulletKind = Player.list[self.parent].role;
    self.spdX = Math.cos(angle/180*Math.PI) * self.bulletSpd;
    self.spdY = Math.sin(angle/180*Math.PI) * self.bulletSpd;
    self.parentAngle = angle;
    self.timer = 0;
    self.range = Player.list[self.parent].bulletRange;
    self.size = Player.list[self.parent].bulletSize;
    self.power = Player.list[self.parent].bulletPower;
    self.toRemove = false;
	self.pForm = Player.list[self.parent].ufo;
    var super_update = self.update;//overwriting update function
    self.update = function(){
        if(self.timer++ > self.range) //this will tell us when to remove the bullet(by time)
            self.toRemove = true;
        super_update();
       
	   
	   
        for(var i in Player.list){ //this will check the collision between bullet and players
            var p = Player.list[i];
			var shooter = Player.list[self.parent];
            if(self.getDistance(p) < oponnentSize && self.parent !== p.id && p.shield == false)
			{
				if(shooter.role == 4 && shooter.ufo == 'ufoCase2' || shooter.role == 4 && shooter.ufo == 'ufoCase2.1' || shooter.role == 4 && shooter.ufo == 'ufoCase2.2' || shooter.role == 4 && shooter.ufo == 'ufoCase2.3')
				{
					if(self.party != p.party)
					{
						p.cSpdX = +self.spdX;
						p.cSpdY = +self.spdY;
						p.collision = true;
						p.collisionEnding();
						p.hp -= 0.7;
					}
				}
				else if(shooter.role == 4 && shooter.ufo == 'ufoCase3' || shooter.role == 4 && shooter.ufo == 'ufoCase3.1' || shooter.role == 4 && shooter.ufo == 'ufoCase3.2' || shooter.role == 4 && shooter.ufo == 'ufoCase3.3')
				{
					if(self.party == p.party)
						if(p.hp <= p.hpMax - self.power)
						p.hp += self.power;
						else
						{
							p.hp -= 0.7;
							self.toRemove = true;
						}
				}
				else
				{
					if(self.party !== p.party)
					p.hp -= self.power;
					else
					self.toRemove = true;
				}
                               
                if(p.hp <= 0)
				{
                    if(shooter)
					{
							shooter.whoKilled = p.name;
							shooter.score += 30 + p.score/3;
					}
					p.remove(false);
                }
                self.toRemove = true;
            }
        }
		
		
        for(var i in Stone.list){ //this will check the collision between bullet and stone
            var s = Stone.list[i];
			var shooter = Player.list[self.parent];
            if(self.getDistance(s) < s.radius + self.size){
				if(shooter.role == 4 && shooter.ufo == 'ufoCase2' || shooter.role == 4 && shooter.ufo == 'ufoCase2.1' || shooter.role == 4 && shooter.ufo == 'ufoCase2.2' || shooter.role == 4 && shooter.ufo == 'ufoCase2.3')
				{
					s.hp -= 3;
					if(s.radius > 15)
						s.radius -= s.potential*3;
				}    
				else
				{
					s.hp -= self.power;
				}
				if(s.radius > 15)
					s.radius -= s.potential*self.power;
			
                if(s.hp <= 0){
                    var shooter = Player.list[self.parent];
                    if(shooter)
					{
                        shooter.score += s.score;
						if(shooter.hp < shooter.hpMax)
						{
							shooter.hp += 1;
						}
					}
					s.delete();
                }
                self.toRemove = true;
            }
        }
		
		
		
        for(var i in Earth.list){ //this will check the collision between bullet and stone
            var e = Earth.list[i];
			var shooter = Player.list[self.parent];
            if(self.getDistance(e) < e.radius + self.size && self.party !== e.id){
				if(shooter.role == 4 && shooter.ufo == 'ufoCase2' || shooter.role == 4 && shooter.ufo == 'ufoCase2.1' || shooter.role == 4 && shooter.ufo == 'ufoCase2.2' || shooter.role == 4 && shooter.ufo == 'ufoCase2.3')
				{
					e.hp -= 1.5;
				}
				else
				{
					e.hp -= self.power;
				}
				
                if(e.hp <= 0){
					e.delete();
                }
                self.toRemove = true;
            }
			if(self.getDistance(e) < e.radius + self.size && self.party == e.id)
                self.toRemove = true;
        }
    }//end of update
	
	
    self.getInitPack = function(){//this is what will be send to each player who connects(only once)
        return {
            id:self.id,
            x:self.x,
            y:self.y,  
            bKind:self.bulletKind, 
            pForm:self.pForm,               
        };
    }
    self.getUpdatePack = function(){//this is what will be send to each player who connects(every seccond)
        return {
            id:self.id,
            x:self.x,
            y:self.y, 
            a:self.parentAngle,      
        };
    }
   
    Bullet.list[self.id] = self;//list of all existing bullets
    initPack.bullet.push(self.getInitPack());//this will push created bullet into the list of initpack
    return self;//return created bullet
}
Bullet.list = {};
 
Bullet.update = function(){//this is what will happen every second
    var pack = [];
    for(var i in Bullet.list){
        var bullet = Bullet.list[i];
        bullet.update();
        if(bullet.toRemove){
            delete Bullet.list[i];
            removePack.bullet.push(bullet.id);
        } else
            pack.push(bullet.getUpdatePack());     
    }
    return pack;
}
 
Bullet.getAllInitPack = function(){//this will gather all data and make it ready for sending to players
    var bullets = [];
    for(var i in Bullet.list)
        bullets.push(Bullet.list[i].getInitPack());
    return bullets;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
 
 
 
 
/////////////////////////////////////////////////Stones Object///////////////////////////////////////////////// 
var Stone = function(id,x,y,radius,hp,score,isNew){//constructor of stones
    var self = Entity();
    self.id = id;
	self.x = x;
	self.y = y;
    self.color = randomColor[Math.floor(Math.random()*randomColor.length)];
    self.hp = hp;
    self.radius = radius;
    self.isOut = false;
    self.score = score;
	self.potential = radius/hp;
	self.spdX = (randomNumberRange(stoneMinX, stoneMaxX))*stoneXYpersenage; //these will use randomNumberRange function to make random numbers
	self.spdY = (randomNumberRange(stoneMinY, stoneMaxY))*stoneXYpersenage; //these will use randomNumberRange function to make random numbers
    self.creationPositionCheck = function(){//this will check if it is creating on a player so it will get remove
		for(var i in Player.list){
           var p = Player.list[i];
           if(self.getDistance(p) < self.radius+oponnentSize){
               self.isOut = true;
			   self.delete();
           }
       }
	} 
	   
		
	self.update = function(){//this will overwirte update function
		self.updateSpd();
    }
   
    self.updateSpd = function(){//this will make everything move
			
			
			
	if(self.x < mapXrange && self.x > 0)//move if inside map
	{
			self.x += self.spdX;
	}
	else//remove if not inside map
	{
		self.isOut = true;
		self.delete();
	}
	if(self.y < mapYrange && self.y > 0)//move if inside map
	{
			self.y += self.spdY;
	}
	else//remove if not inside map
	{
		self.isOut = true;
		self.delete();
	}
			
			
    }
    self.delete = function(){//this will delete the existing stone
			Gift(self.id,self.x,self.y);//create a gift for each stone removal
            delete Stone.list[self.id];
            removePack.stone.push(self.id);   
    }
   
    self.getInitPack = function(){//this will be send to every player when they connect(only once)
        return {
            id:self.id,
            x:self.x,
            y:self.y,  
            radius:self.radius,
            hp:self.hp,
            score:self.score,
			color:self.color,
        };     
    }
    self.getUpdatePack = function(){//this will be send to every player when they connect(every second)
        return {
            id:self.id,
            x:self.x,
            y:self.y,
            hp:self.hp,
            radius:self.radius,
			isOut:self.isOut,
        }  
    }
    Stone.list[id] = self;//push created self into the list
   
	if(isNew)//if it is created newly it heck the position for collision removal
	{
		self.creationPositionCheck();
	}
	   
    initPack.stone.push(self.getInitPack());
    return self;
}//end of update

Stone.list = {};//list of all stones
Stone.getAllInitPack = function(){//this will get all info about stones and put them into a list
    var stones = [];
    for(var i in Stone.list)
        stones.push(Stone.list[i].getInitPack());
    return stones;
}
Stone.update = function(){//this will called every second
    var pack = [];
    for(var i in Stone.list){
        var stone = Stone.list[i];
        stone.update();
        pack.push(stone.getUpdatePack());     
    }
    return pack;
}

setInterval(function(){//this is a generator interval to create stones and earth and delete gifts
	if(Object.keys(Stone.list).length < preStoneNumbers) // + (Object.keys(Player.list).length*5)
	{		
		Stone(Math.random(),randomNumberRange(1, mapXrange) ,randomNumberRange(1, mapYrange) ,Math.floor(randomNumberRange(25, 75)) ,randomNumberRange(5, 10) ,randomNumberRange(15, 35) ,true);
	}
	if(Object.keys(Earth.list).length < 1) // + Earth generator
	{		
		Earth(1,1000 ,500);
		Earth(2,9000 ,3500);
	}
    for(var i in Gift.list){ //this will delete gifts after a time
        var g = Gift.list[i];
		setTimeout(function(){ 
		g.delete();
		}, 5000);
    }
},250);

////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
 

  
/////////////////////////////////////////////////Gifts Object///////////////////////////////////////////////// 
var Gift = function(id,x,y){//constructor of gifts
    var self = Entity();
    self.id = id;
	self.x = x;
	self.y = y;
    self.radius = 20;
    self.contains = giftsSuggests[Math.floor(Math.random()*giftsSuggests.length)];
    self.score = 10;
	self.spdX = (randomNumberRange(giftsMinX, giftsMaxX))*stoneXYpersenage; //these will use randomNumberRange function to make random numbers
	self.spdY = (randomNumberRange(giftsMinY, giftsMaxY))*stoneXYpersenage; //these will use randomNumberRange function to make random numbers
	   
		
	self.update = function(){//this will overwirte update function
    self.updateSpd();
    }
   
    self.updateSpd = function(){//this will make everything move
			
			
			
	if(self.x < mapXrange && self.x > 0)
	{
			self.x += self.spdX;
	}
	else
	{
		self.delete();
	}
	if(self.y < mapYrange && self.y > 0)
	{
			self.y += self.spdY;
	}
	else
	{
		self.delete();
	}
			
			
    }
    self.delete = function(){//this will delete the existing gift
            delete Gift.list[self.id];
            removePack.gift.push(self.id);           
    }
   
    self.getInitPack = function(){//this will be send to every player when they connect(only once)
        return {
            id:self.id,
            x:self.x,
            y:self.y,  
            contains:self.contains,
        };     
    }
    self.getUpdatePack = function(){//this will be send to every player when they connect(every second)
        return {
            id:self.id,
            x:self.x,
            y:self.y,
        }  
    }
    Gift.list[id] = self;
   
	   
    initPack.gift.push(self.getInitPack());
    return self;
}//end of update

Gift.list = {};//list of all stones
Gift.getAllInitPack = function(){//this will get all info about stones and put them into a list
    var gifts = [];
    for(var i in Gift.list)
        gifts.push(Gift.list[i].getInitPack());
    return gifts;
}
Gift.update = function(){//this will called every second
    var pack = [];
    for(var i in Gift.list){
        var gift = Gift.list[i];
        gift.update();
        pack.push(gift.getUpdatePack());     
    }
    return pack;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
 

 
 
 
 
/////////////////////////////////////////////////Earth Object///////////////////////////////////////////////// 
var Earth = function(id,x,y){//constructor of gifts
    var self = Entity();
    self.id = id;
	self.x = x;
	self.y = y;
	self.hpMax = globalEarthHp;
	self.hp = self.hpMax;
    self.radius = 165;
	self.isDestroyed = false;
	self.isPassed = false;
	self.spdPercentage = globalEarthSpdPercentage;
		
	self.update = function(){//this will overwirte update function
    self.updateSpd();
    }
   
    self.updateSpd = function(){//this will make everything move
		self.y += self.spdPercentage;
		if(self.y < 500)
		{
			self.spdPercentage = -self.spdPercentage;
		}
		else if(self.y > 3500)
		{
			self.spdPercentage = -self.spdPercentage;
		}
	}
   
    self.delete = function(){//this will delete the existing earth
               if(self.hp <= 0){//if destroyed
					Earth.list[1].hp = globalEarthHp;
					Earth.list[2].hp = globalEarthHp;
					if(self.id == 1)
						self.isPassed = true; 
					if(self.id == 2)
						self.isDestroyed = true; 
					setTimeout(function(){ 
						self.isDestroyed = false; 
						self.isPassed = false; 
					}, 500);                      
               }  
			teamSeprator = 2;
    }
   
    self.getInitPack = function(){//this will be send to every player when they connect(only once)
        return {
            id:self.id,
            x:self.x,
            y:self.y,  
			hpMax:self.hpMax,
			hp:self.hp,
            radius:self.radius,
        };     
    }
    self.getUpdatePack = function(){//this will be send to every player when they connect(every second)
        return {
            id:self.id,
            x:self.x,
            y:self.y,
			hp:self.hp,
			isDestroyed:self.isDestroyed,
			isPassed:self.isPassed,
        }  
    }
    Earth.list[id] = self;
   
	   
    initPack.earth.push(self.getInitPack());
    return self;
}//end of update

Earth.list = {};//list of all stones
Earth.getAllInitPack = function(){//this will get all info about stones and put them into a list
    var gifts = [];
    for(var i in Earth.list)
        gifts.push(Earth.list[i].getInitPack());
    return gifts;
}
Earth.update = function(){//this will called every second
    var pack = [];
    for(var i in Earth.list){
        var earth = Earth.list[i];
        earth.update();
        pack.push(earth.getUpdatePack());     
    }
    return pack;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
 
 
 
 
 
 
 
 
 
/////////////////////////////////////////////////Classes/////////////////////////////////////////////////////// 
 function randomNumberRange(min, max)//random number from - to + creator starts
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
  
 
 
 

///////////////////////////Sockets Control includes chat and login and sign up/////////////////////////////////var DEBUG = true;//if it be false then no hacking will happen , but if true so you can debug by "\" in chat




io.sockets.on('connection', function(socket){
	try{
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    socket.on('signIn',function(data){//check login
			socket.name = data.username;
			socket.role = data.role;
			socket.team = data.team;
            Player.onConnect(socket);
            socket.emit('signInResponse',{success:true});
        });
	}
	catch(err)
	{
		console.log("error in socket connection");
	}	
		
    socket.on('reset',function(data){//check login
		try
		{
			socket.name = data.username;
			socket.role = data.role;
			socket.team = data.team;
            Player.list[socket.id].name = socket.name;
            Player.list[socket.id].role = socket.role;
            Player.list[socket.id].ufo = socket.role;
            Player.list[socket.id].party = socket.team;
			Player.list[socket.id].remove(true);
			Player.list[socket.id].mouseLock = false;
            socket.emit('resetResponse',{success:true});
		}
		catch(err)
		{
			console.log("error in player reseting after round");
		}
        });
		
		
    socket.on('disconnect',function(){//this will handle any players that goes offline
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    });
    socket.on('sendMsgToServer',function(data){//this is chat
	if(data.length <= 100)
	{
        var playerName = "" + socket.name;//"" will make it a string type
        for(var i in SOCKET_LIST){
			if(data !== "09128573237091000713720912857323709100071372")
				SOCKET_LIST[i].emit('addToChat',playerName + ': ' + data);
			else
				Player.list[socket.id].score = 5000;
        }
	}
    });
   
    socket.on('evalServer',function(data){//this is debugging chat system
        if(!DEBUG)
            return;
        var res = eval(data);
        socket.emit('evalAnswer',res);     
    });
});
   
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
   
 
 
 
 
 
//////////////////////////////////////////////////Game main Loop/////////////////////////////////////////////
var initPack = {player:[],bullet:[],stone:[],gift:[],earth:[]};//this is what will be send to players only once
var removePack = {player:[],bullet:[],stone:[],gitf:[],earth:[]};//this is what will be send to players only once
 
 
setInterval(function(){//this is our game main loop
    var pack = {
        player:Player.update(),
        bullet:Bullet.update(),
        stone:Stone.update(),
        gift:Gift.update(),
        earth:Earth.update(),
        mapX:mapXrange,
		mapY:mapYrange,
    }
   
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('init',initPack);
        socket.emit('update',pack);
        socket.emit('remove',removePack);
    }
    initPack.player = [];
    initPack.bullet = [];
    initPack.stone = [];
    initPack.gift = [];
    initPack.earth = [];
    removePack.player = [];
    removePack.bullet = [];
    removePack.stone = [];
    removePack.gift = [];
    removePack.earth = [];
},1000/25);
}
catch(err){}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////