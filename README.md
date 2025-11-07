# CN-P1
Primera práctica entregable de la asignatura Computación en la Nube (CN) de la ULPGC 

## Subida de imagenes a ECR Acoplada:

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 058264466600.dkr.ecr.us-east-1.amazonaws.com

docker build --platform linux/amd64 -t tasks-acoplada -f ./Dockerfile.acoplada . --provenance=false

docker tag tasks-acoplada:latest 058264466600.dkr.ecr.us-east-1.amazonaws.com/tasks-acoplada:latest

docker push 058264466600.dkr.ecr.us-east-1.amazonaws.com/tasks-acoplada:latest

## Subida de imagenes a ECR Desacoplada:

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 058264466600.dkr.ecr.us-east-1.amazonaws.com

docker build --platform linux/amd64 -t tasks-desacoplada -f ./Dockerfile.desacoplada . --provenance=false

docker tag tasks-desacoplada:latest 058264466600.dkr.ecr.us-east-1.amazonaws.com/tasks-desacoplada:latest

docker push 058264466600.dkr.ecr.us-east-1.amazonaws.com/tasks-desacoplada:latest
