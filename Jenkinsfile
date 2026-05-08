pipeline {
    agent any

    stages {
        stage('Clone App Repository') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/amnamansoor098/bookstore.git'
            }
        }

        stage('Build & Start App Containers') {
            steps {
                sh 'docker-compose -f docker-compose-jenkins.yml down --remove-orphans || true'
                sh 'docker-compose -f docker-compose-jenkins.yml up -d'
                sh 'sleep 15'
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    docker run --rm \
                        --network bookstore-pipeline_default \
                        -e BASE_URL=http://jenkins_web_app:3000 \
                        amnamansoor226/bookstore-tests:latest
                '''
            }
        }

        stage('Verify') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {
        always {
            script {
                def status = currentBuild.result ?: 'SUCCESS'
                def pusherEmail = "amnamansoor226@gmail.com"
                emailext(
                    to: pusherEmail,
                    subject: "Jenkins Build ${status}: bookstore-pipeline #${BUILD_NUMBER}",
                    body: """
                        Build Status: ${status}
                        Build Number: ${BUILD_NUMBER}
                        Job: ${JOB_NAME}
                        
                        Check console output at: ${BUILD_URL}
                    """
                )
            }
        }
        success {
            echo 'All tests passed and deployment successful!'
        }
        failure {
            echo 'Build or tests failed!'
        }
    }
}