import { SigessPage } from './app.po';

describe('sigess App', () => {
  let page: SigessPage;

  beforeEach(() => {
    page = new SigessPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
