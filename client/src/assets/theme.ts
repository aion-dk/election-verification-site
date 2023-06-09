export const defaultTheme = `
  :root {
    --av-theme-background: #212529;
    --av-theme-text: white;
    --av-theme-danger-background: #dc3545;
    --av-theme-danger-text: white;
  }

  .bg-theme {
    color: white;
    --bs-card-cap-color: white;
    background-color: #212529 !important;
  }

  .bg-theme-transparent {
    color: white;
    background-color: rgba(33, 37, 41, 0.7) !important;

  }

  .bg-light-transparent {
    color: white;
    background-color: rgba(255, 255, 255, 0.1) !important;
  }

  .bg-dark-transparent {
      color: white;
      background-color: rgba(0, 0, 0, 0.5) !important;
  }

  .text-theme {
    color: #212529 !important;
  }

  .bg-theme-danger {
    color: white;
    background-color: #dc3545 !important;
  }

  .bg-theme-danger a {
      color: white;
  }

  .bg-theme-danger a:hover {
      color: #ddd;
  }

  .text-contrast {
    color: white !important;
  }

  .text-theme-danger {
    color: #dc3545 !important;
  }

  .border-theme {
    border: 1px solid #0a0b0d;
  }

  .border-theme-danger {
    border: 1px solid #bd2130;
  }

  .theme-gradient {
    background: #212529;
    background: -moz-linear-gradient(top, #383e45 0%, #212529 80%, #16181b 100%);
    background: -webkit-gradient(left top, left bottom, color-stop(0%, #212529), color-stop(80%, #212529), color-stop(100%, #16181b));
    background: -webkit-linear-gradient(top, #383e45 0%, #212529 80%, #16181b 100%);
    background: -o-linear-gradient(top, #383e45 0%, #212529 80%, #16181b 100%);
    background: -ms-linear-gradient(top, #383e45 0%, #212529 80%, #16181b 100%);
    background: linear-gradient(to bottom, #383e45 0%, #212529 80%, #16181b 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#383e45', endColorstr='#16181b', GradientType=0);
  }
`;
