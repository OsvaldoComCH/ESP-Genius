#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <cstdlib>

#define LedAmarelo 14
#define LedVerde 12
#define LedVermelho 13

dotenv::init();
const char * ssid = "SSID";//Nome da Rede
const char * password = "SSID_PASSWORD";//Senha

ESP8266WebServer Server(80);
WiFiClient Client;

IPAddress LocalIP(172, 16, 65, 99);
IPAddress Gateway(172, 16, 79, 234);
IPAddress Subnet(255, 255, 240, 0);
IPAddress PrimaryDNS(172, 16, 64, 5);

class Sequencia
{
    public:
    byte * Lista;
    int Final;
    int Tamanho;
    
    Sequencia(){}

    Sequencia(int Tamanho)
    {
        this->Final = 0;
        this->Tamanho = Tamanho;
        this->Lista = new byte[Tamanho];
    }

    ~Sequencia()
    {
        delete[] this->Lista;
    }

    byte operator[] (int Indice)
    {
        if((unsigned)Indice < Final)
        {
            return this->Lista[Indice];
        }
        return 0;
    }

    void operator<< (byte Valor)
    {
        this->Lista[Final] = Valor;
        ++Final;
        if(Final >= Tamanho)
        {
            byte * NovaLista = new byte[Tamanho*2];
            for(int i = 0; i < Tamanho; ++i)
            {
                NovaLista[i] = this->Lista[i];
            }
            delete[] this->Lista;
            this->Lista = NovaLista;
            Tamanho *= 2;
        }
    }

    byte Ultimo()
    {
        return this->Lista[Final - 1];
    }
};

Sequencia Lista (10);

void PiscarLED(byte led)
{
    digitalWrite(led, HIGH);
    delay(1000);
    digitalWrite(led, LOW);
}

void MostrarSequencia()
{
    for(int i = 0; i < Lista.Final; ++i)
    {
        PiscarLED(Lista[i] + 11);
        Serial.println(Lista[i]);
        delay(500);
    }
}

byte Mode = 0;
byte Pos = 0;

byte ValidateInput(byte Signal)
{
    if(Signal == Lista[Pos])
    {
        Mode = 1;
        return 1;
    }else
    {
        Mode = 0;
        return 0;
    }
}

byte Streak = 0;

void ServerResponse(byte Result)
{
    char str[100];
    sprintf(str, "{\"result\":%i,\"streak\":%i}", Result, Streak);
    Server.send(200, "application/json", str);
}

void Sinal1()
{
    byte Result = ValidateInput(1);
    ServerResponse(Result);
}
void Sinal2()
{
    byte Result = ValidateInput(2);
    ServerResponse(Result);
}
void Sinal3()
{
    byte Result = ValidateInput(3);
    ServerResponse(Result);
}

void setup()
{
    Serial.begin(9600);

    if(!WiFi.config(LocalIP, Gateway, Subnet, PrimaryDNS))
    {
        Serial.println("Nao foi possivel conectar com o IP padrao");
    }

    WiFi.hostname("espgenius");
    WiFi.begin(ssid, password);
    WiFi.softAP(ssid);
    while(WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    
    Serial.println("\nWiFi Connected");
    Serial.println(WiFi.localIP());

    Server.on("/amarelo", &Sinal1);
    Server.on("/verde", &Sinal2);
    Server.on("/vermelho", &Sinal3);

    Server.enableCORS(true);
    
    pinMode(14, OUTPUT);
    pinMode(12, OUTPUT);
    pinMode(13, OUTPUT);

    randomSeed(analogRead(6));
    Server.begin();
}

void loop()
{
    Lista << random(1,4);
    MostrarSequencia();
    for(Pos = 0; Pos < Lista.Final; ++Pos)
    {
        Mode = 2;

        while(Mode == 2)
        {
            Server.handleClient();
            delay(100);
        }

        if(Mode == 0)
        {
            digitalWrite(LedAmarelo, HIGH);
            digitalWrite(LedVerde, HIGH);
            digitalWrite(LedVermelho, HIGH);
            delay(3000);
            digitalWrite(LedAmarelo, LOW);
            digitalWrite(LedVerde, LOW);
            digitalWrite(LedVermelho, LOW);

            Lista = Sequencia();
            Streak = -1;
            break;
        }else
        {
            PiscarLED(11+Lista[Pos]);
        }
        delay(3000);
    }
    ++Streak;
}
