---
layout: post
title: "Android에서 googlemap 사용"
date: 2017-03-29
excerpt: "android에서 Googlemap을 사용하는 방법"
tags: [android, googlemap]
comments: true
---

# AndroidManifest.xml

할당 받은 API Key를 가지고 사용하기 위한 초기 설정을 진행한다.

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="https://schemas.android.com/apk/res/android"
    package="io.github.mj_youn.testapplication">

<!-- 인터넷 사용과 위치 정보 사용을 위한 permission 추가 -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <activity
            android:name=".MainActivity"
            android:screenOrientation="portrait" >
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

<!-- API KEY 정보 추가 -->
        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="API KEY" />

    </application>

</manifest>
```

# MainActivity.java

```java
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.Circle;
import com.google.android.gms.maps.model.CircleOptions;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.gms.maps.model.PolylineOptions;

import org.json.JSONObject;

import java.io.IOException;

import io.github.mj_youn.testapplication.DTO.InfoDTO;
import io.github.mj_youn.testapplication.service.TestService;

public class MainActivity extends AppCompatActivity implements OnMapReadyCallback {

    private TestService testService = new TestService();

    private static final LatLng SEOUL = new LatLng(37.56, 126.97);
    private GoogleMap googleMap;
    private Marker marker;
    private Circle circle;
    private Polyline polyline;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        MapFragment mapFragment = (MapFragment) getFragmentManager().findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
    }

    @Override
    public void onMapReady(final GoogleMap map) {
        googleMap = map;

        marker = googleMap.addMarker(new MarkerOptions().position(SEOUL).title("Seoul"));
        circle = googleMap.addCircle(new CircleOptions().center(SEOUL)
                                                        .radius(10000)
                                                        .strokeColor(Color.RED)
                                                        .fillColor(0x5500ff00));
        polyline = googleMap.addPolyline(new PolylineOptions().add(new LatLng(36.383615, 127.367548), new LatLng(36.385584, 127.378502), new LatLng(36.374628, 127.379645))
                                                                .width(5)
                                                                .color(Color.RED));

        CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLngZoom(SEOUL, 10);
        googleMap.animateCamera(cameraUpdate);
    }

    public void clickSearch(View v) {
        String longitude = ((EditText)findViewById(R.id.longitude)).getText().toString();
        String latitude = ((EditText)findViewById(R.id.latitude)).getText().toString();

        if (longitude.equals("") || latitude.equals("")) {
            Toast toast = Toast.makeText(getApplicationContext(), "위도, 경도를 모두 입력해 주세요.", Toast.LENGTH_LONG);
            toast.setGravity(Gravity.BOTTOM, 0, 300);
            toast.show();
        } else {
            System.out.println("longitude >> " + longitude + ", latitude >> " + latitude);

            LatLng newPosition = new LatLng(Double.parseDouble(latitude), Double.parseDouble(longitude));

            marker.setPosition(newPosition);
            marker.setTitle(latitude + ", " + longitude);

            circle.setCenter(newPosition);

            CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLngZoom(newPosition, 10);
            googleMap.animateCamera(cameraUpdate);
        }
    }
}
```

# Gradle Script - build.gradle(Module: app)

기본적으로 google map을 사용하기 위한 dependency를 추가해준다.

```xml
dependencies {
  ...

  compile 'com.google.android.gms:play-services:10.2.0'

  ...
}
```
