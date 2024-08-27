import * as loader from '../../src/util/loader'

jest.spyOn(loader, 'image').mockImplementation((s, p) => s.asset.getImage(`/${p}`))
