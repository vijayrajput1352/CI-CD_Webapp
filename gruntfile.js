'use strict';

module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt); // eslint-disable-line node/no-unpublished-require

	grunt.initConfig({
		'pkg': grunt.file.readJSON('package.json'),

		'env': {
			'mochaTest': {
				'NODE_ENV': 'test'
			}

		},

		'eslint': {
			'options': {
				'config': '.eslintrc.json',
				'format': 'junit',
				'outputFile': 'buildresults/eslint-orig.xml'
			},
			'target': ['.']
		},

		'exec': {
			'clean': {
				'command': 'npm run-script clean'
			},
			'clinic-clean': {
				'command': 'npm run-script clinic-clean'
			},
			'clinic-upload': {
				'command': 'npm run-script clinic-upload'
			},
			'docs': {
				'command': 'npm run-script docs'
			},
			'organize_build_results': {
				'command': 'mkdir -p ./buildresults/mocha && mkdir -p ./buildresults/eslint && mkdir -p ./buildresults/istanbul && mkdir -p ./buildresults/performance && mv ./.clinic/*.clinic-* ./buildresults/performance && mv ./buildresults/lint.xml ./buildresults/eslint/results.xml && mv ./buildresults/tests.xml ./buildresults/mocha/results.xml && mv ./buildresults/cobertura-coverage.xml ./buildresults/istanbul/results.xml && mv ./buildresults/lcov.info ./buildresults/istanbul/lcov.info'
			},
			'rename-docs': {
				'command': 'mv ./jsdoc_default/webapp-server/<%= pkg.version %> ./docs && rm -r ./jsdoc_default'
			},
			'run-clinic': {
				'command': 'npm run-script clinic-doctor && npm run-script clinic-flame && npm run-script clinic-profile'
			},
			'setup-test-db': {
				'command': 'cd ./knex_migrations && NODE_ENV=test ./../node_modules/.bin/knex migrate:latest && NODE_ENV=test ./../node_modules/.bin/knex seed:run && cd ../test/knex_migrations && NODE_ENV=test ./../../node_modules/.bin/knex seed:run && cd ../..'
			},
			'undo-test-db': {
				'command': 'cd ./knex_migrations && NODE_ENV=test ./../node_modules/.bin/knex migrate:rollback --all && cd .. && redis-cli flushall'
			},
			'setup-elassandra-db': {
				'command': 'cd test/cql && cqlsh --connect-timeout=60 --request-timeout=600 -f ./setup_test_keyspace.cql'
			},
			'undo-elassandra-db': {
				'command': 'cd test/cql && cqlsh --connect-timeout=60 --request-timeout=600 -f ./undo_test_keyspace.cql'
			},
			'setup-elassandra-indexing': {
				'command': 'sh ./test/elassandra_indexing/setup_test_indexing.sh'
			},
			'undo-elassandra-indexing': {
				'command': 'sh ./test/elassandra_indexing/undo_test_indexing.sh'
			}
		},

		'mochaTest': {
			'test': {
				'options': {
					'clearRequireCache': false,
					'noFail': false,
					'quiet': false,
					'recursive': true,
					'reporter': 'mocha-junit-reporter',
					'reporterOptions': {
						'mochaFile': './buildresults/tests.xml'
					},
					'require': ['./test/setup_mocks'],
					'timeout': 50000
				},

				'src': ['./test/**/*.spec.js']
			}
		},

		'mocha_istanbul': {
			'coverage': {
				'src': 'test',
				'options': {
					'mask': '**/*.spec.js',
					'coverageFolder': 'buildresults',
					'clearRequireCache': false,
					'noFail': false,
					'quiet': false,
					'recursive': true,
					'require': ['./test/setup_mocks'],
					'reportFormats': ['cobertura', 'lcovonly'],
					'timeout': 50000
				}
			}
		},

		'xmlstoke': {
			'deleteESLintBugs': {
				'options': {
					'actions': [{
						'type': 'D',
						'xpath': '//failure[contains(@message, \'node_modules\')]/ancestor::testsuite'
					}]
				},
				'files': {
					'buildresults/eslint-no-bugs.xml': 'buildresults/eslint-orig.xml'
				}
			},
			'deleteEmptyTestcases': {
				'options': {
					'actions': [{
						'type': 'D',
						'xpath': '//testcase[not(node())]'
					}]
				},
				'files': {
					'buildresults/eslint-no-empty-testcases.xml': 'buildresults/eslint-no-bugs.xml'
				}
			},
			'deleteEmptyTestsuites': {
				'options': {
					'actions': [{
						'type': 'D',
						'xpath': '//testsuite[not(descendant::testcase)]'
					}]
				},
				'files': {
					'buildresults/eslint-no-empty-testsuites.xml': 'buildresults/eslint-no-empty-testcases.xml'
				}
			},
			'prettify': {
				'options': {
					'actions': [{
						'type': 'U',
						'xpath': '//text()'
					}]
				},
				'files': {
					'buildresults/lint.xml': 'buildresults/eslint-no-empty-testsuites.xml'
				}
			}
		},

		'jsbeautifier': {
			'src': ['buildresults/*.xml', 'docs/*.html'],
			'options': {
				'config': '.jsbeautifyrc'
			}
		},

		'clean': ['buildresults/eslint-orig.xml', 'buildresults/eslint-no-bugs.xml', 'buildresults/eslint-no-empty-testcases.xml', 'buildresults/eslint-no-empty-testsuites.xml', 'buildresults/coverage.raw.json']
	});

	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-mocha-istanbul');
	grunt.loadNpmTasks('grunt-xmlstoke');

	grunt.registerTask('default', ['exec:clean', 'env', 'eslint', 'xmlstoke:deleteESLintBugs', 'xmlstoke:deleteEmptyTestcases', 'xmlstoke:deleteEmptyTestsuites', 'xmlstoke:prettify', 'exec:undo-test-db','exec:undo-elassandra-indexing', 'exec:undo-elassandra-db', 'exec:setup-test-db', 'exec:setup-elassandra-db','exec:setup-elassandra-indexing','mochaTest', 'exec:undo-test-db', 'exec:setup-test-db', 'mocha_istanbul:coverage', 'exec:docs', 'exec:rename-docs', 'exec:run-clinic', 'clean', 'jsbeautifier', 'exec:organize_build_results', 'exec:clinic-clean', 'exec:undo-test-db', 'exec:setup-test-db']);
};
