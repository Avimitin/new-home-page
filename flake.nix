{
  description = "Generic devshell setup";

  inputs = {
    # The nixpkgs
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

    # Utility functions
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    let
      pkgsForSys = system: import nixpkgs { inherit system; };
      perSystem = (system:
        let
          pkgs = pkgsForSys system;
        in
        {
          devShells.default = pkgs.mkShell {
            buildInputs = with pkgs; [
              nodePackages_latest.nodejs
              nodePackages_latest.typescript-language-server
            ];
          };

          formatter = pkgs.nixpkgs-fmt;
        });
    in
    {
      # Other system-independent attr
    } //

    flake-utils.lib.eachDefaultSystem perSystem;
}
