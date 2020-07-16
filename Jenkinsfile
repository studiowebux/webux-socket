pipeline {
  agent {
    node {
      label 'nodejs'
    }

  }
  stages {
    stage('Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run-script lint'
      }
    }

    stage('Test') {
      steps {
        sh 'npm run test'
      }
    }

    stage('Versionning') {
      steps {
        script {
          env.RELEASE_SCOPE = input message: 'User input required', ok: 'Release!',
                            parameters: [choice(name: 'RELEASE_SCOPE', choices: 'patch\nminor\nmajor', description: 'What is the release scope?')]
        }
        echo '${env.RELEASE_SCOPE}'
      }
    }

    stage('Staging') {
      steps {
        sh 'npm version ${env.RELEASE_SCOPE}'
        sh 'npm publish --registry=https://npm.webux.lab'
        input 'Deploy to production ?'
      }
    }

    stage('Production') {
      steps {
        sh 'npm publish'
        mail(subject: 'Webux-socket - Published', body: 'Webux-socket has been published to production')
      }
    }

  }
  post {
    failure {
        mail to: 'tommy@studiowebux.com',
        subject: "Failed Pipeline ${currentBuild.fullDisplayName}",
        body: " For details about the failure, see ${env.BUILD_URL}"
    }
  }
}