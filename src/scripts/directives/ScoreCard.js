/**
 * Progress/Left Steps indicator
 * ### Used for:
 *
 *     GLOBAL, RFA flow
 *
 * @author JuliusGromyko <IGromyko@luxoft.com>
 */

angular.module("app.directives").directive("scoreCard", scoreCard);

function scoreCard() {
    return {
        restrict: 'E',
        scope: {
            state: "@",
            labels: "="
        },
        templateUrl: '/views/directives/ScoreCard.html',
        link: function() {}
    };
}