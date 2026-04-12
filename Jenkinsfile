pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/amnamansoor098/bookstore.git'
            }
        }

        stage('Build & Start Containers') {
            steps {
                sh 'docker-compose -f docker-compose-jenkins.yml down --remove-orphans || true'
                sh 'docker-compose -f docker-compose-jenkins.yml up -d'
            }
        }

        stage('Verify') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'Build and deployment successful!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}