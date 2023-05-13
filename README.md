# Potshe-Server
UMC 3rd final project Potshe
해루질, 통발, 투망 등 포인트 공유 플랫폼(POTSHE)

생물 채집활동을 하기에 좋은 장소인 포인트를 쉽게 찾고 공유할 수 있는 앱 서비스입니다.

원하는 포인트를 검색할 수 있고, 직접 방문한 포인트에 대한 게시물을 등록한 후 다른 사람들과 공유할 수 있습니다.

AWS의 EC2를 통해 서버 인스턴스를 생성하였고, RDS 기능을 통해 관계형 데이터베이스를 구축하였습니다. 그리고, S3 서비스를 기반으로 앱에 필요한 사진들을 관리하는 스토리지를 생성하여 활용하였습니다. 백엔드 서비스에 필요한 인프라 지식을 AWS 기술을 사용하면서 습득할 수 있었고, 향후 클라우드 기술을 활용하는 프로젝트에 적용해보고 싶습니다.

# 기술 스택
Node.JS, AWS EC2, RDS, S3 기술을 사용하여 백엔드 환경을 구축하고 필요한 API 들을 제작하였습니다.

# 구현 핵심 기능 : 클라우드형 스토리지를 활용한 사진 관리
![potshe-s3](https://github.com/Potshe/Potshe-Server/assets/49470452/5372e425-634b-4f18-9f5e-34f40f0e4a15)

서비스에 가입한 유저들이 프로필 사진을 등록하거나, 포인트를 등록할 때 사진과 함께 등록할 경우, 그 사진들을 S3 서비스를 통해 만든 버킷에 저장하였습니다.

AWS S3 버킷에 이미지 파일을 저장하고 DB엔 그 버킷의 이미지 파일 경로를 저장 후, 클라이언트로 경로명을 전달해주는 로직을 구현하기 위해 Multer-S3 와 AWS-SDK 모듈을 사용하였습니다.

AWS IAM 콘솔에서 S3 권한 키를 생성하였고, 키 정보와 Multer-S3의 multer 함수를 바탕으로 S3 버킷에 접근하여 파일을 업로드해주는 로직을 완성하였습니다.

모듈을 설치하고 활용하던 도중, ‘Can’t find module ‘@aws-sdk/abort-controller’ 오류가 발생하였습니다. 오류의 원인을 찾아본 결과, AWS-SDK 모듈의 버전과 Multer-S3의 버전이 동일해야 한다는 사실을 알게 되었습니다. 기존의 모듈을 삭제하고 맞는 버전으로 재설치를 하고 나니 오류를 해결할 수 있었습니다.
