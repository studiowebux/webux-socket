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

    stage('Staging') {
      steps {
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
}