describe('Timeline Onboarding Flow', () => {
  function getRandomPhone() {
    // Generate a random 10-digit phone number starting with 9
    return '9' + Math.floor(100000000 + Math.random() * 900000000).toString();
  }

  let testPhone;

  beforeEach(() => {
    testPhone = getRandomPhone();
    // Reset test user before each test
    cy.request('POST', '/api/reset-test-user', { phone: testPhone });

    // Go to home page and sign up through the header button
    cy.visit('/');
    cy.contains('Sign up to be healthy', { matchCase: false }).click();
    
    // Fill out the signup form in AuthModal
    cy.get('input[placeholder="Enter your phone number"]').type(testPhone);
    cy.get('input[placeholder="Choose a username"]').type('TestUser');
    cy.get('input[placeholder="Create a password (min 6 chars)"]').type('testuser');
    cy.contains('CONTINUE', { matchCase: false }).click();
    
    // Wait for OTP step to appear (after 800ms delay)
    cy.wait(1000); // Wait for the OTP step to load
    
    // Handle OTP step - pause for manual OTP entry
    cy.get('body').then(($body) => {
      if ($body.find('input[inputMode="numeric"]').length > 0) {
        // OTP step is present - pause for manual entry
        cy.log('OTP step detected - please manually enter the OTP and click Verify OTP');
        cy.pause(); // This will pause the test and wait for you to resume
        cy.log('Resuming test after manual OTP entry');
      }
    });
    
    // After OTP verification, AuthModal redirects to /hero-story, but user is not logged in
    cy.url().should('include', '/hero-story');
    cy.wait(1000); // Wait for hero-story to load
    
    // Now we need to log in with the newly created user
    cy.visit('/login');
    cy.get('input[placeholder="Enter your phone number"]').type(testPhone);
    cy.get('input[placeholder="Enter your password"]').type('testuser');
    cy.contains('CONTINUE', { matchCase: false }).click();
    cy.url().should('not.include', '/login'); // Ensure login succeeded
    
    // Now navigate to onboarding as an authenticated user
    cy.visit('/onboarding');
    cy.url().should('include', '/onboarding');
    cy.wait(500);
  });

  function debugIfNextNotFound() {
    cy.document().then(doc => {
      // Log the page content for debugging
      // eslint-disable-next-line no-console
      console.log(doc.body.innerHTML);
    });
    cy.screenshot('onboarding-page-debug');
  }

  it('should complete the onboarding flow with valid data', () => {
    cy.get('input[placeholder*="IronRunner"]').type('TestHero');
    cy.contains('Next', { matchCase: false }).should('exist');
    cy.contains('Next', { matchCase: false }).click();
    cy.get('input[placeholder*="John Doe"]').type('Test User');
    cy.contains('Next', { matchCase: false }).click();
    cy.contains('Next', { matchCase: false }).click(); // skip avatar
    cy.get('select').first().select(1); // Gender
    cy.contains('Next', { matchCase: false }).click();
    cy.get('input[type="date"]').type('1990-01-01');
    cy.contains('Next', { matchCase: false }).click();
    cy.get('input[placeholder*="Height"]').type('180');
    cy.contains('Next', { matchCase: false }).click();
    cy.get('input[placeholder*="Weight"]').type('75');
    cy.contains('Next', { matchCase: false }).click();
    cy.get('select').first().select(1); // Activity Level
    cy.contains('Next', { matchCase: false }).click();
    cy.get('select').first().select(1); // Fitness Goal
    cy.contains('Next', { matchCase: false }).click();
    cy.get('select').first().select(1); // Dietary Preference
    cy.contains('Next', { matchCase: false }).click();
    cy.get('input[type="number"]').type('8');
    cy.contains('Next', { matchCase: false }).click();
    cy.get('input[type="range"]').invoke('val', 5).trigger('change');
    cy.contains('Next', { matchCase: false }).click();
    cy.contains('Next', { matchCase: false }).click(); // skip medical
    cy.get('input[placeholder*="city"]').type('TestCity');
    cy.contains('Complete', { matchCase: false }).should('exist').click();
    cy.url().should('include', '/dashboard');
  });

  it('should not proceed if required fields are empty', () => {
    cy.contains('Next').click();
    cy.url().should('include', '/onboarding');
  });

  it('should show error if API fails', () => {
    cy.intercept('POST', '/api/profile', {
      statusCode: 500,
      body: { success: false, error: 'Server error' },
    }).as('profilePost');
    cy.get('input[placeholder*="IronRunner"]').type('TestHero');
    cy.contains('Next').click();
    cy.get('input[placeholder*="John Doe"]').type('Test User');
    cy.contains('Next').click();
    cy.contains('Next').click(); // skip avatar
    cy.get('select').first().select(1);
    cy.contains('Next').click();
    cy.get('input[type="date"]').type('1990-01-01');
    cy.contains('Next').click();
    cy.get('input[placeholder*="Height"]').type('180');
    cy.contains('Next').click();
    cy.get('input[placeholder*="Weight"]').type('75');
    cy.contains('Next').click();
    cy.get('select').first().select(1);
    cy.contains('Next').click();
    cy.get('select').first().select(1);
    cy.contains('Next').click();
    cy.get('select').first().select(1);
    cy.contains('Next').click();
    cy.get('input[type="number"]').type('8');
    cy.contains('Next').click();
    cy.get('input[type="range"]').invoke('val', 5).trigger('change');
    cy.contains('Next').click();
    cy.contains('Next').click();
    cy.get('input[placeholder*="city"]').type('TestCity');
    cy.contains('Complete').click();
    cy.wait('@profilePost');
    cy.contains('Server error').should('exist');
  });

  it('should allow skipping optional fields and still complete onboarding', () => {
    cy.get('input[placeholder*="IronRunner"]').type('TestHero');
    cy.contains('Next').click();
    cy.get('input[placeholder*="John Doe"]').type('Test User');
    cy.contains('Next').click();
    cy.contains('Next').click(); // skip avatar
    cy.get('select').first().select(1);
    cy.contains('Next').click();
    cy.get('input[type="date"]').type('1990-01-01');
    cy.contains('Next').click();
    cy.get('input[placeholder*="Height"]').type('180');
    cy.contains('Next').click();
    cy.get('input[placeholder*="Weight"]').type('75');
    cy.contains('Next').click();
    cy.get('select').first().select(1);
    cy.contains('Next').click();
    cy.get('select').first().select(1);
    cy.contains('Next').click();
    cy.get('select').first().select(1);
    cy.contains('Next').click();
    cy.get('input[type="number"]').type('8');
    cy.contains('Next').click();
    cy.get('input[type="range"]').invoke('val', 5).trigger('change');
    cy.contains('Next').click();
    cy.contains('Next').click(); // skip medical
    cy.get('input[placeholder*="city"]').type('TestCity');
    cy.contains('Complete').click();
    cy.url().should('include', '/dashboard');
  });
}); 