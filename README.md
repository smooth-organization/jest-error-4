These are the steps that are needed in order to get the error:

1. Clone the repo (no need to `yarn install` because of zero installs)
2. Run both tests `yarn run test-simple` and `yarn run test-react` - they are setup in such a way that both files contain two tests - one should work, one should fail. When tests are run for the first time, you should get a lot of "Internal error in the corejs3 provider: unknown polyfill" warnings, but for the time being this is fine.
3. Clear the resolutions field in the package.json file and `yarn install`. After that there should be several updates in the cache folder:

![cache folder](https://user-images.githubusercontent.com/121542269/220281768-c0873860-82a5-49e0-b070-acc4e1cbef85.png)

4. Run both tests again. The simple one should remain unchanged, but the react one should throw the error:

![error](https://user-images.githubusercontent.com/121542269/220282119-7429a294-ce4d-4705-9214-62493c4b7f6f.png)

