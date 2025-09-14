# Contributing to PitchLense

Thank you for your interest in contributing to PitchLense! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Code Style](#code-style)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please be respectful, inclusive, and constructive in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/PitchLense.git
   cd PitchLense
   ```
3. **Add the upstream repository**:
   ```bash
   git remote add upstream https://github.com/connectaman/PitchLense.git
   ```

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**:
   Create a `backend/.env` file with the required variables (see README.md for details)

3. **Start the development server**:
   ```bash
   npm run start
   ```

4. **Access the application**:
   Open `http://localhost:5178` in your browser

## Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

- **Bug fixes**: Fix issues and improve stability
- **Feature additions**: Add new functionality
- **Documentation**: Improve or add documentation
- **UI/UX improvements**: Enhance the user interface
- **Performance optimizations**: Improve application performance
- **Testing**: Add or improve test coverage

### Before You Start

1. **Check existing issues** to see if your contribution is already being worked on
2. **Create an issue** for significant changes to discuss the approach
3. **Keep changes focused** - one feature or bug fix per pull request

## Pull Request Process

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

- Test your changes thoroughly
- Ensure the application still works as expected
- Check for any console errors
- Test on different screen sizes if UI changes

### 4. Commit Your Changes

```bash
git add .
git commit -m "Add: brief description of your changes"
```

Use clear, descriptive commit messages:
- `Add:` for new features
- `Fix:` for bug fixes
- `Update:` for improvements
- `Remove:` for deletions
- `Docs:` for documentation changes

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:
- Clear title and description
- Reference any related issues
- Screenshots for UI changes
- Testing instructions

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs actual behavior
4. **Screenshots** if applicable
5. **Environment details** (browser, OS, etc.)
6. **Console errors** if any

### Issue Template

```markdown
**Bug Description:**
[Clear description of the bug]

**Steps to Reproduce:**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior:**
[What you expected to happen]

**Actual Behavior:**
[What actually happened]

**Screenshots:**
[If applicable, add screenshots]

**Environment:**
- OS: [e.g., Windows 10, macOS, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 22]

**Additional Context:**
[Any other context about the problem]
```

## Feature Requests

For feature requests, please:

1. **Check existing issues** to avoid duplicates
2. **Describe the feature** clearly
3. **Explain the use case** and benefits
4. **Provide examples** if possible
5. **Consider implementation** complexity

## Code Style

### JavaScript/HTML/CSS

- Use consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing patterns in the codebase

### File Organization

- Keep related files together
- Use descriptive file names
- Follow the existing directory structure

### CSS/Styling

- Use Tailwind CSS classes when possible
- Add custom styles to `styles.css` when needed
- Follow the existing color scheme and design patterns
- Ensure responsive design

## Testing

### Manual Testing

Before submitting a pull request:

1. **Test the feature** thoroughly
2. **Check different browsers** (Chrome, Firefox, Safari)
3. **Test responsive design** on different screen sizes
4. **Verify accessibility** (keyboard navigation, screen readers)
5. **Check for console errors**

### Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive design works
- [ ] Accessibility maintained
- [ ] Performance not degraded
- [ ] Documentation updated

## Documentation

### Code Documentation

- Add comments for complex functions
- Document API endpoints
- Update README.md for significant changes
- Include examples in documentation

### User Documentation

- Update feature descriptions
- Add screenshots for UI changes
- Provide clear usage instructions
- Update the built-in help system

## Getting Help

If you need help:

1. **Check the documentation** in README.md
2. **Search existing issues** for similar problems
3. **Create a new issue** with your question
4. **Join discussions** in existing issues

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## License

By contributing to PitchLense, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to PitchLense! 🚀
