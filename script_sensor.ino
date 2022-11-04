int lm35_pin = A0, leitura_lm35 = 0;

float temperatura;

float temperatura_1;
float temperatura_2;
float temperatura_3;
float temperatura_4;
float temperatura_5;
float temperatura_6;
float temperatura_7;
float temperatura_8;
float temperatura_9;
float temperatura_10;
float temperatura_11;
float temperatura_12;
float temperatura_13;
float temperatura_14;
float temperatura_15;

void setup() {
  Serial.begin(9600);
}

void loop() {
  leitura_lm35 = analogRead(lm35_pin);
  temperatura = leitura_lm35 * (5.0/1023) * 100;

  temperatura_1 = (temperatura * 0.25) + 5;
  temperatura_2 = (temperatura * 0.1667) + 43.332;
  temperatura_3 = (temperatura * 0.41) + 4,57;
  temperatura_4 = (temperatura * 0.8) + 52;
  temperatura_5 = (temperatura * 0.83) + 2.16;
  temperatura_6 = (temperatura * 0.4167) + 23.332;
  temperatura_7 = (temperatura * 1.25) + 1.40;
  temperatura_8 = (temperatura * 0.4167) + 50.332;
  temperatura_9 = (temperatura * 0.16) + 15.9;
  temperatura_10 = (temperatura * 0.4167) - 4.668;
  temperatura_11 = (temperatura * 0.41) + 1.03;
  temperatura_12 = (temperatura * 0.1667) - 0.668;
  temperatura_13 = (temperatura * 0.16) + 0.31;
  temperatura_14 = (temperatura * 0.83) + 36.66;
  temperatura_15 = (temperatura * 0.41) + 0.42;
  
  
  
  Serial.print(temperatura_1);
  Serial.print(";");
  Serial.print(temperatura_2);
  Serial.print(";");
  Serial.print(temperatura_3);
  Serial.print(";");
  Serial.print(temperatura_4);
  Serial.print(";");
  Serial.print(temperatura_5);
  Serial.print(";");
  Serial.print(temperatura_6);
  Serial.print(";");
  Serial.print(temperatura_7);
  Serial.print(";");
  Serial.print(temperatura_8);
  Serial.print(";");
  Serial.print(temperatura_9);
  Serial.print(";");
  Serial.print(temperatura_10);
  Serial.print(";");
  Serial.print(temperatura_11);
  Serial.print(";");
  Serial.print(temperatura_12);
  Serial.print(";");
  Serial.print(temperatura_13);
  Serial.print(";");
  Serial.print(temperatura_14);
  Serial.print(";");
  Serial.print(temperatura_15);
  Serial.println(";");
  
  delay(1000);

}
