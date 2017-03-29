---
layout: post
title: "Swift3에서 googlemap 사용"
date: 2017-03-29
excerpt: "swift 3.X 버전에서 Google map을 연동하여 사용하는 방법"
tags: [ios, swift, swift3, googlemap]
comments: true
---

# 프로젝트에 googlemap 사용 준비

우선 swift 프로젝트를 생성하고 여기에 `cocoapods`을 사용하여 googlemap을 이용할 수 있게 만들어야한다.

 - `cocoapods`이 mac에 안깔려있을 경우 설치를 한다.

```sh
$ sudo gem install cocoapods
```

 - swift 프로젝트 폴더에 `Podfile`이라는 파일을 만들어주고 다음과 같이 설정한다.
 - `<프로젝트 이름>`에는 생성한 프로젝트의 이름을 넣어준다.

```
source 'https://github.com/CocoaPods/Specs.git'
platform :ios, '10.3'
target "<프로젝트 이름>" do
  pod 'GoogleMaps'
end
```

 - `terminal`을 열어 swift프로젝트 폴더에서 설치를 해준다.

```sh
$ pod install
```

 - XCode를 닫은 다음 프로젝트 폴더의 `.xcworkspace`파일을 실행하여 프로젝트를 진행한다.
 - 계속 위에 파일을 열어서 진행해야 한다.

<https://developers.google.com/maps/documentation/ios-sdk/start?hl=ko>에서 `cocoapods` 사용 방법을 상세하게 확인 할 수 있다.

# AppDelegate.swift

Google map을 연동하기 위해서는 google map api key가 있어야한다.

이는 Google 검색시에 많은 자료가 나오고, google api console자체에도 설명이 잘 되어 있기 때문에 설명하지 않겠다.

```objectivec
import UIKit
import GoogleMaps

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
    GMSServices.provideAPIKey("API KEY")
    return true
  }

  ...
}
```

# ViewController.swift

Google 검색을 해보면 쉽게 google map 연동 방법을 찾을 수 있다.

하지만 검색의 나오는 대부분의 화면은 모든 화면을 map으로 채워놓은 정말 map을 위한 app 개발을 보여주고 있다.

필자는 그것이 아니라 화면이외에도 여러 방식으로 map을 사용할 수 있게 하기 위해서 화면의 일부분에 map을 표시한다.

```objectivec
import UIKit
import GoogleMaps

class ViewController: UIViewController, GMSMapViewDelegate {
    @IBOutlet weak var latitude: UITextField!
    @IBOutlet weak var longitude: UITextField!
    @IBOutlet weak var search: UIButton!
    @IBOutlet weak var mapView: GMSMapView!

    var marker: GMSMarker!
    var circle: GMSCircle!
    var polyline: GMSPolyline!

    override func viewDidLoad() {
        super.viewDidLoad()

        mapView.delegate = self
        mapView.animate(to: GMSCameraPosition.camera(withLatitude: 36.351366, longitude: 127.386742, zoom: 14))
        mapView.isMyLocationEnabled = true

        marker = GMSMarker()
        marker.position = CLLocationCoordinate2DMake(36.351366, 127.386742)
        marker.title = "대전"
//        marker.snippet = "설명"
        marker.map = mapView

        circle = GMSCircle()
        circle.position = CLLocationCoordinate2DMake(36.351366, 127.386742)
        circle.radius = 1000
        circle.fillColor = UIColor(red: 0.35, green: 0, blue: 0, alpha: 0.05)
        circle.strokeColor = UIColor.red
        circle.strokeWidth = 5
        circle.map = mapView

        let path = GMSMutablePath()
        path.add(CLLocationCoordinate2DMake(36.399596, 127.400838))
        path.add(CLLocationCoordinate2DMake(36.399596, 127.404887))
        path.add(CLLocationCoordinate2DMake(36.393830, 127.404960))

        let polyline = GMSPolyline(path: path)
        polyline.map = mapView

        search.addTarget(self, action: #selector(searchMap(button:)), for: .touchUpInside)
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(dismissKeyboard))
        self.view.addGestureRecognizer(tap)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    func searchMap(button: UIButton) {
        let latitudeDouble:Double! = Double(latitude.text!)
        let longitudeDouble:Double! = Double(longitude.text!)

        dismissKeyboard()

        if (latitudeDouble == nil || longitudeDouble == nil) {
            NSLog("Error")
            showToast(message: "위도, 경도를 정확히 입력해주세요.")
        } else if (abs(latitudeDouble) > 90 || abs(longitudeDouble) > 180) {
            NSLog("Error")
            showToast(message: "범위를 벗어납니다.")
        }else {
            NSLog("latitude >> %f", latitudeDouble ?? 0.0)
            NSLog("longitude >> %f", longitudeDouble ?? 0.0)

            marker.position = CLLocationCoordinate2DMake(latitudeDouble, longitudeDouble)
            marker.title = "\(String(format: "%.3f", latitudeDouble)), \(String(format: "%.3f", longitudeDouble))"

            circle.position = CLLocationCoordinate2DMake(latitudeDouble, longitudeDouble)

            mapView.animate(to: GMSCameraPosition.camera(withLatitude: latitudeDouble, longitude: longitudeDouble, zoom: 14))
        }
    }

    func dismissKeyboard() {
        self.view.endEditing(true)
    }
}

 // toast를 출력하기 위한 함수
extension UIViewController {
    func showToast(message : String) {
        let toastLabel = UILabel(frame: CGRect(x: self.view.frame.size.width/2 - 150, y: self.view.frame.size.height - 150, width: 300, height: 35))
        toastLabel.backgroundColor = UIColor.black.withAlphaComponent(0.6)
        toastLabel.textColor = UIColor.white
        toastLabel.textAlignment = .center;
        toastLabel.font = UIFont(name: "Montserrat-Light", size: 12.0)
        toastLabel.text = message
        toastLabel.alpha = 1.0
        toastLabel.layer.cornerRadius = 10;
        toastLabel.clipsToBounds  =  true
        self.view.addSubview(toastLabel)
        UIView.animate(withDuration: 4.0, delay: 0.1, options: .curveEaseOut, animations: {
            toastLabel.alpha = 0.0
        }, completion: {(isCompleted) in
            toastLabel.removeFromSuperview()
        })
    }
}
```
